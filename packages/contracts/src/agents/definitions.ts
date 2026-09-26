
import { z } from "zod";
import { UUIDSchema, TimestampSchema } from "../api/envelope";

export const AgentToolSchema = z.object({
  toolId: UUIDSchema,
  name: z.string(),
  description: z.string().nullable(),
  inputSchema: z.record(z.any()),
});

export type AgentTool = z.infer<typeof AgentToolSchema>;

export const AgentDefinitionSchema = z.object({
  agentId: UUIDSchema,
  name: z.string(),
  config: z.record(z.any()),
  modelProfileId: UUIDSchema,
  tools: z.array(AgentToolSchema),
});

export type AgentDefinition = z.infer<typeof AgentDefinitionSchema>;

export interface ModelGateway {
  generateResponse(prompt: string, config: any): Promise<{ text: string; usage: any }>;
  streamResponse(prompt: string, config: any): Promise<AsyncIterable<{ chunk: string; usage?: any }>>;
}

export interface AgentToolExecutor {
  execute(toolName: string, args: any): Promise<any>;
}

