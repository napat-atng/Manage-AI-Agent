
import { z } from "zod";
import { UUIDSchema, TimestampSchema } from "../api/envelope";

export const EventEnvelopeSchema = z.object({
  id: UUIDSchema,
  taskId: UUIDSchema,
  sequence: z.number().int().nonnegative(),
  type: z.string(),
  payload: z.record(z.any()),
  occurredAt: TimestampSchema,
  correlationId: UUIDSchema.optional(),
  eventVersion: z.number().int().default(1),
});

export type EventEnvelope = z.infer<typeof EventEnvelopeSchema>;

export interface EventPublisher {
  publish(event: EventEnvelope): Promise<void>;
}

