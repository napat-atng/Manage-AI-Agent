
import { z } from "zod";
import { UUIDSchema, TimestampSchema } from "../api/envelope";

export const BaseEntitySchema = z.object({
  id: UUIDSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;

