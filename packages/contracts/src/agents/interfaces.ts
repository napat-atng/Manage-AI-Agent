// src/agents/interfaces.ts
import { z } from "zod";
import { RequestIdSchema } from "../primitives.js";

export const AgentDefinitionSchema = z.object({
  id: RequestIdSchema,
  name: z.string(),
  description: z.string().optional(),
  version: z.string(),
  capabilities: z.array(z.string())
});
export type AgentDefinition = z.infer<typeof AgentDefinitionSchema>;

export const ModelGatewaySchema = z.object({
  modelId: z.string(),
  provider: z.enum(["ollama", "litellm"]),
  config: z.any()
});
export type ModelGateway = z.infer<typeof ModelGatewaySchema>;

export const AgentToolSchema = z.object({
  id: RequestIdSchema,
  name: z.string(),
  description: z.string().optional(),
  inputSchema: z.any(),
  outputSchema: z.any()
});
export type AgentTool = z.infer<typeof AgentToolSchema>;

export const WorkflowEngineSchema = z.object({
  // Placeholder functions
  start: z.any(),
  stop: z.any()
});
export type WorkflowEngine = z.infer<typeof WorkflowEngineSchema>;

export const WorkflowCompilerSchema = z.object({
  compile: z.any()
});
export type WorkflowCompiler = z.infer<typeof WorkflowCompilerSchema>;

export const EventPublisherSchema = z.object({
  publish: z.any()
});
export type EventPublisher = z.infer<typeof EventPublisherSchema>;
