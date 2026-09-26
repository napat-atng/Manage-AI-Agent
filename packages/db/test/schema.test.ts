import { describe, it, expect } from " vitest\;
import { TaskSchema } from \../src/schemas/database\;

describe(\Database Schemas\, () => {
 it(\should validate valid task data\, () => {
 const validTask = {
 taskId: \550e8400-e29b-41d4-a716-446655440000\,
 workflowId: \550e8400-e29b-41d4-a716-446655440001\,
 userId: \550e8400-e29b-41d4-a716-446655440002\,
 status: \pending\,
 inputData: {},
 outputData: null,
 startedAt: null,
 completedAt: null,
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 };
 expect(TaskSchema.parse(validTask)).toEqual(validTask);
 });

 it(\should fail invalid UUID\, () => {
 const invalidTask = { taskId: \not-a-uuid\ };
 expect(() => TaskSchema.parse(invalidTask)).toThrow();
 });
});
