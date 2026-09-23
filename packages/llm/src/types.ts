// src/types.ts - Domain types for the LLM Gateway layer

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCallId?: string;
  name?: string;
}

export interface CompletionRequest {
  messages: ChatMessage[];
  /** Model profile name (from DB), defaults to default profile if omitted */
  modelProfile?: string;
  /** Override temperature */
  temperature?: number;
  /** Max tokens to generate */
  maxTokens?: number;
  /** Correlation ID for request tracing */
  correlationId?: string;
}

export interface UsageStats {
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
}

export interface CompletionResponse {
  content: string;
  model: string;
  provider: string;
  latencyMs: number;
  usage: UsageStats;
  correlationId?: string;
}

export interface StreamChunk {
  delta: string;
  done: boolean;
  model?: string;
}

export interface ModelProfileConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  apiBase: string | null;
  config: Record<string, unknown>;
  isDefault: boolean;
}

/** Typed retryable vs non-retryable errors */
export class GatewayError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean,
    public readonly provider?: string,
  ) {
    super(message);
    this.name = 'GatewayError';
  }
}

export class RetryableGatewayError extends GatewayError {
  constructor(message: string, code: string, provider?: string) {
    super(message, code, true, provider);
    this.name = 'RetryableGatewayError';
  }
}

export class NonRetryableGatewayError extends GatewayError {
  constructor(message: string, code: string, provider?: string) {
    super(message, code, false, provider);
    this.name = 'NonRetryableGatewayError';
  }
}
