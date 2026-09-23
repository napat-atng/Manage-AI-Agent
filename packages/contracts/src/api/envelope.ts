import { z } from 'zod';
import { PaginationMetaSchema, RequestIdSchema } from '../primitives.js';

export const ApiErrorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
  code: z.string().optional(),
});
export type ApiErrorDetail = z.infer<typeof ApiErrorDetailSchema>;

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(ApiErrorDetailSchema).optional(),
  }),
  requestId: RequestIdSchema.optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export function createApiSuccessSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: PaginationMetaSchema.optional(),
    requestId: RequestIdSchema.optional(),
  });
}

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: z.infer<typeof PaginationMetaSchema>;
  requestId?: string;
};
