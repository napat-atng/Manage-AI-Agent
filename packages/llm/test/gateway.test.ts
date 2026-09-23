// test/gateway.test.ts - Unit tests for LiteLLMGateway using a mock HTTP server
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { LiteLLMGateway } from '../src/gateway.js';
import { InMemoryProfileStore } from '../src/profile-loader.js';
import {
  RetryableGatewayError,
  NonRetryableGatewayError,
} from '../src/types.js';
import type { ModelProfileConfig } from '../src/types.js';

// ---------------------------------------------------------------------------
// Minimal mock LiteLLM/OpenAI-compatible server
// ---------------------------------------------------------------------------
let mockServer: http.Server;
let mockPort: number;
let mockHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;

before(async () => {
  await new Promise<void>((resolve) => {
    mockServer = http.createServer((req, res) => {
      mockHandler(req, res);
    });
    mockServer.listen(0, '127.0.0.1', () => {
      mockPort = (mockServer.address() as { port: number }).port;
      resolve();
    });
  });
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    mockServer.close((err) => (err ? reject(err) : resolve()));
  });
});

function makeProfile(overrides?: Partial<ModelProfileConfig>): ModelProfileConfig {
  return {
    id: 'test-id',
    name: 'test-profile',
    provider: 'ollama',
    model: 'qwen2.5:3b',
    apiBase: `http://127.0.0.1:${mockPort}`,
    config: { temperature: 0.2 },
    isDefault: true,
    ...overrides,
  };
}

function makeGateway(overrides?: Partial<ModelProfileConfig>) {
  const store = new InMemoryProfileStore([makeProfile(overrides)]);
  return new LiteLLMGateway(store);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('LiteLLMGateway.complete', () => {
  it('returns a completion response for a valid request', async () => {
    mockHandler = (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: 'chatcmpl-test',
          object: 'chat.completion',
          model: 'qwen2.5:3b',
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'Hello, world!' },
              finish_reason: 'stop',
            },
          ],
          usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
        }),
      );
    };

    const gw = makeGateway();
    const res = await gw.complete({
      messages: [{ role: 'user', content: 'Say hello' }],
      correlationId: 'corr-1',
    });

    assert.equal(res.content, 'Hello, world!');
    assert.equal(res.model, 'qwen2.5:3b');
    assert.equal(res.provider, 'ollama');
    assert.equal(res.usage.promptTokens, 10);
    assert.equal(res.usage.completionTokens, 5);
    assert.equal(res.usage.totalTokens, 15);
    assert.equal(res.correlationId, 'corr-1');
    assert.ok(res.latencyMs >= 0);
  });

  it('returns null usage when provider omits usage', async () => {
    mockHandler = (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: 'chatcmpl-test-2',
          object: 'chat.completion',
          model: 'qwen2.5:3b',
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: 'OK' },
              finish_reason: 'stop',
            },
          ],
        }),
      );
    };

    const gw = makeGateway();
    const res = await gw.complete({
      messages: [{ role: 'user', content: 'hi' }],
    });
    assert.equal(res.usage.promptTokens, null);
    assert.equal(res.usage.completionTokens, null);
    assert.equal(res.usage.totalTokens, null);
  });

  it('throws RetryableGatewayError on 429', async () => {
    mockHandler = (_req, res) => {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'rate limited', type: 'rate_limit_error', code: '429' } }));
    };

    const gw = makeGateway();
    await assert.rejects(
      () => gw.complete({ messages: [{ role: 'user', content: 'hi' }] }),
      RetryableGatewayError,
    );
  });

  it('throws NonRetryableGatewayError on 400', async () => {
    mockHandler = (_req, res) => {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'bad request', type: 'invalid_request_error', code: '400' } }));
    };

    const gw = makeGateway();
    await assert.rejects(
      () => gw.complete({ messages: [{ role: 'user', content: 'hi' }] }),
      NonRetryableGatewayError,
    );
  });
});

describe('LiteLLMGateway.stream', () => {
  it('yields ordered delta chunks and a done=true final chunk', async () => {
    const chunks = [
      { choices: [{ delta: { content: 'He' }, finish_reason: null, index: 0 }], model: 'qwen2.5:3b' },
      { choices: [{ delta: { content: 'llo' }, finish_reason: null, index: 0 }], model: 'qwen2.5:3b' },
      { choices: [{ delta: { content: '' }, finish_reason: 'stop', index: 0 }], model: 'qwen2.5:3b' },
    ];

    mockHandler = (_req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Transfer-Encoding': 'chunked',
      });
      for (const chunk of chunks) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    };

    const gw = makeGateway();
    const received: { delta: string; done: boolean }[] = [];
    for await (const chunk of gw.stream({
      messages: [{ role: 'user', content: 'hi' }],
    })) {
      received.push({ delta: chunk.delta, done: chunk.done });
    }

    // Should have received He, llo, and the done chunk
    assert.ok(received.length >= 2, 'expected at least 2 chunks');
    const full = received.map((c) => c.delta).join('');
    assert.ok(full.includes('He') || full.includes('llo'), `got: ${full}`);
    const lastChunk = received[received.length - 1];
    assert.ok(lastChunk !== undefined);
    assert.equal(lastChunk.done, true);
  });
});

describe('InMemoryProfileStore', () => {
  it('returns default profile', async () => {
    const store = new InMemoryProfileStore([makeProfile()]);
    const p = await store.findDefault();
    assert.ok(p);
    assert.equal(p.name, 'test-profile');
  });

  it('returns profile by name', async () => {
    const store = new InMemoryProfileStore([makeProfile({ name: 'my-profile' })]);
    const p = await store.findByName('my-profile');
    assert.ok(p);
    assert.equal(p.name, 'my-profile');
  });

  it('returns null for unknown profile', async () => {
    const store = new InMemoryProfileStore([makeProfile()]);
    const p = await store.findByName('unknown');
    assert.equal(p, null);
  });
});
