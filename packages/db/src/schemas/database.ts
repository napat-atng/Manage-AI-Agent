
import { z } from "zod";

// Utility for UUID validation
const uuid = z.string().uuid();
const timestamp = z.string().datetime();

// --- User Schemas ---
export const UserSchema = z.object({
  userId: uuid,
  email: z.string().email(),
  passwordHash: z.string().min(1),
  fullName: z.string().nullable(),
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const SessionSchema = z.object({
  sessionId: uuid,
  userId: uuid,
  refreshToken: z.string(),
  expiresAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
});

// --- AI Model & Agent Schemas ---
export const ModelProfileSchema = z.object({
  modelProfileId: uuid,
  provider: z.string(),
  modelName: z.string(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
  systemPrompt: z.string().nullable(),
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const AgentSchema = z.object({
  agentId: uuid,
  name: z.string().min(1),
  description: z.string().nullable(),
  createdBy: uuid.nullable(),
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const AgentVersionSchema = z.object({
  versionId: uuid,
  agentId: uuid,
  versionNumber: z.number().int().nonnegative(),
  config: z.record(z.any()),
  modelProfileId: uuid.nullable(),
  createdAt: timestamp,
});

// --- Tool Schemas ---
export const ToolSchema = z.object({
  toolId: uuid,
  name: z.string(),
  description: z.string().nullable(),
  inputSchema: z.record(z.any()),
  createdAt: timestamp,
  updatedAt: timestamp,
});

// --- Workflow Schemas ---
export const WorkflowSchema = z.object({
  workflowId: uuid,
  name: z.string().min(1),
  description: z.string().nullable(),
  createdBy: uuid.nullable(),
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const WorkflowVersionSchema = z.object({
  versionId: uuid,
  workflowId: uuid,
  versionNumber: z.number().int().nonnegative(),
  definition: z.record(z.any()),
  createdAt: timestamp,
});

// --- Execution Schemas ---
export const TaskSchema = z.object({
  taskId: uuid,
  workflowId: uuid.nullable(),
  userId: uuid.nullable(),
  status: z.enum(["pending", "running", "completed", "failed"]),
  inputData: z.record(z.any()).nullable(),
  outputData: z.record(z.any()).nullable(),
  startedAt: timestamp.nullable(),
  completedAt: timestamp.nullable(),
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const TaskStepSchema = z.object({
  stepId: uuid,
  taskId: uuid,
  stepIndex: z.number().int().nonnegative(),
  agentVersionId: uuid.nullable(),
  status: z.enum(["pending", "running", "completed", "failed"]),
  inputData: z.record(z.any()).nullable(),
  outputData: z.record(z.any()).nullable(),
  startedAt: timestamp.nullable(),
  completedAt: timestamp.nullable(),
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const AgentRunSchema = z.object({
  runId: uuid,
  stepId: uuid,
  modelProfileId: uuid.nullable(),
  prompt: z.string(),
  response: z.string(),
  tokenUsage: z.number().int().positive().optional(),
  durationMs: z.number().int().positive().optional(),
  createdAt: timestamp,
});

export const ToolRunSchema = z.object({
  runId: uuid,
  stepId: uuid,
  toolId: uuid,
  arguments: z.record(z.any()),
  result: z.record(z.any()).nullable(),
  error: z.string().nullable(),
  durationMs: z.number().int().positive().optional(),
  createdAt: timestamp,
});

export const MessageSchema = z.object({
  messageId: uuid,
  taskId: uuid,
  role: z.enum(["system", "user", "assistant", "tool"]),
  content: z.string(),
  createdAt: timestamp,
});

export const EventSchema = z.object({
  eventId: uuid,
  taskId: uuid,
  sequence: z.number().int().nonnegative(),
  eventType: z.string(),
  payload: z.record(z.any()),
  createdAt: timestamp,
});

export const OutboxJobSchema = z.object({
  jobId: uuid,
  aggregateId: uuid,
  aggregateType: z.string(),
  eventType: z.string(),
  payload: z.record(z.any()),
  status: z.enum(["pending", "processed", "failed"]),
  processedAt: timestamp.nullable(),
  createdAt: timestamp,
});

