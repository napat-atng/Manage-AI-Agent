
import { z } from "zod";
import { UUIDSchema } from "../api/envelope";

export const WorkflowNodeSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("agent"), agentId: UUIDSchema, inputMapping: z.record(z.any()) }),
  z.object({ type: z.literal("tool"), toolId: UUIDSchema, inputMapping: z.record(z.any()) }),
  z.object({ type: z.literal("condition"), expression: z.string(), branches: z.record(z.any()) }),
  z.object({ type: z.literal("approval"), role: z.string(), timeoutMs: z.number().optional() }),
  z.object({ type: z.literal("transform"), script: z.string() }),
]);

export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;

export const WorkflowDefinitionSchema = z.object({
  workflowId: UUIDSchema,
  version: z.number().int(),
  nodes: z.array(z.object({
    id: z.string(),
    node: WorkflowNodeSchema,
    next: z.string().nullable(),
  })),
  startNodeId: z.string(),
});

export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;

export interface WorkflowEngine {
  start(workflowId: string, input: any): Promise<string>; // returns taskId
  step(taskId: string): Promise<void>;
  getStatus(taskId: string): Promise<any>;
}

export interface WorkflowCompiler {
  compile(definition: WorkflowDefinition): Promise<any>;
  validate(definition: WorkflowDefinition): Promise<{ valid: boolean; errors?: any[] }>;
}

