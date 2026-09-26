// src/types.ts - Agent Core domain types
import { z } from 'zod';

// -------------------------------------------------------
// Tool descriptor (the version of a tool bound to an agent)
// -------------------------------------------------------
export const ToolDescriptorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  inputSchema: z.record(z.any()),
});
export type ToolDescriptor = z.infer<typeof ToolDescriptorSchema>;

// -------------------------------------------------------
// Version snapshot — immutable, loaded once per run
// -------------------------------------------------------
export const AgentVersionSnapshotSchema = z.object({
  id: z.string().uuid(),
  agentId: z.string().uuid(),
  agentName: z.string(),
  agentRole: z.string(),
  version: z.number().int().positive(),
  systemPrompt: z.string(),
  modelProfileId: z.string().uuid(),
  config: z.record(z.any()),
  allowedTools: z.array(ToolDescriptorSchema),
});
export type AgentVersionSnapshot = z.infer<typeof AgentVersionSnapshotSchema>;

// -------------------------------------------------------
// Execution context provided at runtime by the caller
// -------------------------------------------------------
export const ExecutionContextSchema = z.object({
  taskId: z.string().uuid(),
  stepId: z.string().uuid().optional(),
  correlationId: z.string().optional(),
  /** Extra context injected into messages (e.g. task goal) */
  taskContext: z.string().optional(),
});
export type ExecutionContext = z.infer<typeof ExecutionContextSchema>;

// -------------------------------------------------------
// Input / Output for agent runs
// -------------------------------------------------------
export const AgentInputSchema = z.object({
  userMessage: z.string().min(1),
});
export type AgentInput = z.infer<typeof AgentInputSchema>;

export const AgentOutputSchema = z.object({
  content: z.string(),
  model: z.string(),
  provider: z.string(),
  latencyMs: z.number(),
  usage: z.object({
    promptTokens: z.number().nullable(),
    completionTokens: z.number().nullable(),
    totalTokens: z.number().nullable(),
  }),
  agentRunId: z.string().uuid(),
});
export type AgentOutput = z.infer<typeof AgentOutputSchema>;

// -------------------------------------------------------
// Domain events emitted by the executor (not transport-specific)
// -------------------------------------------------------
export type AgentRunEvent =
  | { type: 'run.started'; agentRunId: string; taskId: string; agentVersionId: string }
  | { type: 'run.completed'; agentRunId: string; latencyMs: number }
  | { type: 'run.failed'; agentRunId: string; error: string };

// -------------------------------------------------------
// Tool call request (returned by model for tool-use)
// -------------------------------------------------------
export const ToolCallRequestSchema = z.object({
  toolName: z.string(),
  args: z.record(z.any()),
});
export type ToolCallRequest = z.infer<typeof ToolCallRequestSchema>;

// -------------------------------------------------------
// Lifecycle hook interface (pluggable persistence layer)
// -------------------------------------------------------
export interface AgentRunRepository {
  create(params: {
    id: string;
    taskId: string;
    stepId?: string | null;
    agentVersionId: string;
    status: string;
  }): Promise<void>;

  updateStatus(id: string, status: string, metrics?: Record<string, unknown>): Promise<void>;
}
