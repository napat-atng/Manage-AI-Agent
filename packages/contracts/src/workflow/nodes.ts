// src/workflow/nodes.ts
import { z } from "zod";
import { RequestIdSchema } from "../primitives.js";

export const AgentNode = z.object({
  type: z.literal("agent"),
  agentId: RequestIdSchema,
  input: z.any()
});

export const ToolNode = z.object({
  type: z.literal("tool"),
  toolId: RequestIdSchema,
  args: z.any()
});

export const ConditionNode = z.object({
  type: z.literal("condition"),
  expression: z.string()
});

export const ApprovalNode = z.object({
  type: z.literal("approval"),
  approverId: RequestIdSchema,
  timeoutSec: z.number().int().positive().optional()
});

export const TransformNode = z.object({
  type: z.literal("transform"),
  transformFn: z.string()
});

export const WorkflowNode = z.union([
  AgentNode,
  ToolNode,
  ConditionNode,
  ApprovalNode,
  TransformNode
]);
