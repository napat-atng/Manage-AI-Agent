// src/events/envelope.ts
import { z } from "zod";
import { RequestIdSchema, IsoUtcDateTimeSchema } from "../primitives.js";

export const EventEnvelopeSchema = z.object({
  id: z.string().uuid(),
  taskId: RequestIdSchema,
  sequence: z.number().int().nonnegative(),
  type: z.string(),
  occurredAt: IsoUtcDateTimeSchema,
  correlationId: RequestIdSchema.optional(),
  version: z.number().int().positive().default(1),
  payload: z.any()
});

export type EventEnvelope = z.infer<typeof EventEnvelopeSchema>;
