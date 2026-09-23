// src/gateway.ts - LiteLLM-backed ModelGateway implementation
import OpenAI from 'openai';
import type {
  CompletionRequest,
  CompletionResponse,
  StreamChunk,
  ModelProfileConfig,
} from './types.js';
import {
  RetryableGatewayError,
  NonRetryableGatewayError,
} from './types.js';
import type { ProfileStore } from './profile-loader.js';
import { envDefaultProfile } from './profile-loader.js';

const DEFAULT_TIMEOUT_MS = 60_000;
const MAX_RETRIES = 2; // only for retryable errors

function buildClient(profile: ModelProfileConfig): OpenAI {
  return new OpenAI({
    baseURL: profile.apiBase ?? 'http://localhost:4000',
    apiKey: process.env['LITELLM_API_KEY'] ?? 'sk-no-key',
    timeout: DEFAULT_TIMEOUT_MS,
    maxRetries: 0, // we handle retries ourselves
    defaultHeaders: {
      'x-provider': profile.provider,
    },
  });
}

function normaliseUsage(usage: OpenAI.CompletionUsage | undefined | null) {
  return {
    promptTokens: usage?.prompt_tokens ?? null,
    completionTokens: usage?.completion_tokens ?? null,
    totalTokens: usage?.total_tokens ?? null,
  };
}

function classifyError(err: unknown, provider: string): never {
  if (err instanceof OpenAI.APIError) {
    const status = err.status ?? 0;
    if (status === 429 || status >= 500) {
      throw new RetryableGatewayError(
        `${provider}: ${err.message}`,
        `HTTP_${status}`,
        provider,
      );
    }
    throw new NonRetryableGatewayError(
      `${provider}: ${err.message}`,
      `HTTP_${status}`,
      provider,
    );
  }
  if (err instanceof Error && err.message.includes('timeout')) {
    throw new RetryableGatewayError(`${provider}: request timeout`, 'TIMEOUT', provider);
  }
  throw new NonRetryableGatewayError(
    `${provider}: unknown error`,
    'UNKNOWN',
    provider,
  );
}

export class LiteLLMGateway {
  constructor(private readonly store?: ProfileStore) {}

  private async resolveProfile(name?: string): Promise<ModelProfileConfig> {
    if (!this.store) return envDefaultProfile();
    const profile = name
      ? await this.store.findByName(name)
      : await this.store.findDefault();
    return profile ?? envDefaultProfile();
  }

  async complete(req: CompletionRequest): Promise<CompletionResponse> {
    const profile = await this.resolveProfile(req.modelProfile);
    const client = buildClient(profile);

    const startMs = Date.now();
    let attempt = 0;

    while (true) {
      try {
        const res = await client.chat.completions.create({
          model: profile.model,
          messages: req.messages.map((m) => {
            if (m.role === 'tool') {
              return {
                role: 'tool' as const,
                content: m.content,
                tool_call_id: m.toolCallId ?? '',
              };
            }
            return {
              role: m.role as 'system' | 'user' | 'assistant',
              content: m.content,
            };
          }),
          temperature: req.temperature ?? (profile.config['temperature'] as number | undefined) ?? 0.2,
          ...(req.maxTokens ? { max_tokens: req.maxTokens } : {}),
        }, {
          headers: {
            ...(req.correlationId ? { 'x-correlation-id': req.correlationId } : {}),
          },
        });

        const choice = res.choices[0];
        if (!choice) throw new NonRetryableGatewayError('No choices returned', 'NO_CHOICE', profile.provider);

        return {
          content: choice.message.content ?? '',
          model: res.model,
          provider: profile.provider,
          latencyMs: Date.now() - startMs,
          usage: normaliseUsage(res.usage),
          correlationId: req.correlationId,
        };
      } catch (err) {
        // Re-throw if already classified
        if (err instanceof RetryableGatewayError && attempt < MAX_RETRIES) {
          attempt++;
          await new Promise((r) => setTimeout(r, 200 * attempt));
          continue;
        }
        if (err instanceof RetryableGatewayError || err instanceof NonRetryableGatewayError) {
          throw err;
        }
        classifyError(err, profile.provider);
      }
    }
  }

  async *stream(req: CompletionRequest): AsyncGenerator<StreamChunk> {
    const profile = await this.resolveProfile(req.modelProfile);
    const client = buildClient(profile);

    let stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
    try {
      stream = await client.chat.completions.create({
        model: profile.model,
        messages: req.messages.map((m) => {
          if (m.role === 'tool') {
            return {
              role: 'tool' as const,
              content: m.content,
              tool_call_id: m.toolCallId ?? '',
            };
          }
          return {
            role: m.role as 'system' | 'user' | 'assistant',
            content: m.content,
          };
        }),
        temperature: req.temperature ?? (profile.config['temperature'] as number | undefined) ?? 0.2,
        stream: true,
        ...(req.maxTokens ? { max_tokens: req.maxTokens } : {}),
      }, {
        headers: {
          ...(req.correlationId ? { 'x-correlation-id': req.correlationId } : {}),
        },
      });
    } catch (err) {
      classifyError(err, profile.provider);
    }

    let model = profile.model;
    for await (const chunk of stream!) {
      if (chunk.model) model = chunk.model;
      const delta = chunk.choices[0]?.delta?.content ?? '';
      const done = chunk.choices[0]?.finish_reason != null;
      yield { delta, done, model };
      if (done) break;
    }
  }
}
