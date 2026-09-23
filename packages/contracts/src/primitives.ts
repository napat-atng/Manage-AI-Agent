import { z } from 'zod';

export const UuidSchema = z
  .string()
  .uuid({ message: 'Must be a valid UUID' });
export type Uuid = z.infer<typeof UuidSchema>;

export const IsoUtcDateTimeSchema = z
  .string()
  .datetime({ message: 'Must be a valid ISO 8601 UTC timestamp' });
export type IsoUtcDateTime = z.infer<typeof IsoUtcDateTimeSchema>;

export const RequestIdSchema = z
  .string()
  .min(1)
  .max(128, { message: 'Request ID must not exceed 128 characters' });
export type RequestId = z.infer<typeof RequestIdSchema>;

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const PaginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
