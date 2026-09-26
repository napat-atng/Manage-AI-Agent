// src/executor.ts - Agent executor: composes prompt, calls gateway, persists lifecycle
import { randomUUID } from 'node:crypto';
import type { LiteLLMGateway } from '@aacc/llm';
import type {
  AgentVersionSnapshot,
  AgentInput,
  AgentOutput,
  AgentRunRepository,
  AgentRunEvent,
  ExecutionContext,
} from './types.js';
import { AgentInputSchema, ExecutionContextSchema } from './types.js';

export type EventEmitter = (event: AgentRunEvent) => void;

export interface AgentExecutorOptions {
  gateway: LiteLLMGateway;
  repository?: AgentRunRepository;
  onEvent?: EventEmitter;
}

/**
 * Executes a single agent turn given a pinned version snapshot.
 * Validates input, composes system + task context + user message,
 * calls the LLM gateway, persists lifecycle, and emits domain events.
 */
export class AgentExecutor {
  private readonly gateway: LiteLLMGateway;
  private readonly repository?: AgentRunRepository;
  private readonly onEvent?: EventEmitter;

  constructor(opts: AgentExecutorOptions) {
    this.gateway = opts.gateway;
    this.repository = opts.repository;
    this.onEvent = opts.onEvent;
  }

  async run(
    snapshot: AgentVersionSnapshot,
    ctx: ExecutionContext,
    input: AgentInput,
  ): Promise<AgentOutput> {
    // --- Validate inputs ---
    const validCtx = ExecutionContextSchema.parse(ctx);
    const validInput = AgentInputSchema.parse(input);

    const agentRunId = randomUUID();
    const startMs = Date.now();

    // --- Persist run start ---
    await this.repository?.create({
      id: agentRunId,
      taskId: validCtx.taskId,
      stepId: validCtx.stepId ?? null,
      agentVersionId: snapshot.id,
      status: 'running',
    });

    this.onEvent?.({
      type: 'run.started',
      agentRunId,
      taskId: validCtx.taskId,
      agentVersionId: snapshot.id,
    });

    // --- Compose messages ---
    const messages = buildMessages(snapshot, validCtx, validInput);

    try {
      const completion = await this.gateway.complete({
        messages,
        correlationId: validCtx.correlationId,
        // Use temperature from version config if available
        temperature: typeof snapshot.config['temperature'] === 'number'
          ? snapshot.config['temperature']
          : undefined,
      });

      // --- Tool Binding Enforcement ---
      // In a real scenario, 'completion' would contain tool_calls.
      // For now, we simulate checking if the LLM requested a tool (represented as structured content here)
      // or if the gateway were to return a list of requested tools.
      // Since LiteLLMGateway.complete currently only returns content string,
      // we implement the check against the content if it contains a tool call pattern,
      // or prepare for when the gateway is updated to return explicit tool calls.

      // Simulation of tool call detection from completion.content
      // (assuming a format like 'CALL: tool_name')
      if (completion.content.startsWith('CALL: ')) {
        const toolName = completion.content.replace('CALL: ', '').trim();
        if (!this.isToolAllowed(snapshot, toolName)) {
          throw new Error(`Tool binding violation: tool '${toolName}' is not allowed for this agent version.`);
        }
      }

      const latencyMs = Date.now() - startMs;

      // --- Persist run completion ---
      await this.repository?.updateStatus(agentRunId, 'completed', {
        latencyMs,
        promptTokens: completion.usage.promptTokens,
        completionTokens: completion.usage.completionTokens,
        totalTokens: completion.usage.totalTokens,
        model: completion.model,
        provider: completion.provider,
      });

      this.onEvent?.({ type: 'run.completed', agentRunId, latencyMs });

      return {
        content: completion.content,
        model: completion.model,
        provider: completion.provider,
        latencyMs,
        usage: completion.usage,
        agentRunId,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);

      await this.repository?.updateStatus(agentRunId, 'failed', { error: errorMsg });
      this.onEvent?.({ type: 'run.failed', agentRunId, error: errorMsg });

      throw err;
    }
  }

  /**
   * Check whether a tool name is allowed for this agent version.
   */
  isToolAllowed(snapshot: AgentVersionSnapshot, toolName: string): boolean {
    return snapshot.allowedTools.some((t) => t.name === toolName);
  }
}

// ---------------------------------------------------------------------------
// Message builder
// ---------------------------------------------------------------------------
function buildMessages(
  snapshot: AgentVersionSnapshot,
  ctx: ExecutionContext,
  input: AgentInput,
): { role: 'system' | 'user' | 'assistant'; content: string }[] {
  const systemParts: string[] = [snapshot.systemPrompt];

  if (ctx.taskContext) {
    systemParts.push(`\n\n## Task Context\n${ctx.taskContext}`);
  }

  if (snapshot.allowedTools.length > 0) {
    const toolList = snapshot.allowedTools
      .map((t) => `- ${t.name}${t.description ? `: ${t.description}` : ''}`)
      .join('\n');
    systemParts.push(`\n\n## Available Tools\n${toolList}`);
  }

  return [
    { role: 'system', content: systemParts.join('') },
    { role: 'user', content: input.userMessage },
  ];
}
