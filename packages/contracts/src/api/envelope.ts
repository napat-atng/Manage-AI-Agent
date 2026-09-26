
import { z } from "zod";

export const TimestampSchema = z.string().datetime();
export type Timestamp = z.infer<typeof TimestampSchema>;

export const UUIDSchema = z.string().uuid();
export type UUID = z.infer<typeof UUIDSchema>;

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
  requestId: UUIDSchema,
  timestamp: TimestampSchema,
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const ApiSuccessSchema = z.object({
  data: z.any(),
  requestId: UUIDSchema,
  timestamp: TimestampSchema,
});

export type ApiSuccess<T> = z.infer<typeof ApiSuccessSchema> & { data: T };

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = z.object({
  items: z.array(z.any()),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

export type PaginatedResponse<T> = z.infer<typeof PaginatedResponseSchema> & { items: T[] };

