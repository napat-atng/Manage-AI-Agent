
import { Queue, Worker, Job } from "bullmq";

export const TASK_QUEUE_NAME = "task-execution";
export const OUTBOX_QUEUE_NAME = "outbox-dispatch";

export class TaskQueue {
  private queue: Queue;

  constructor(redisConfig: any) {
    this.queue = new Queue(TASK_QUEUE_NAME, { connection: redisConfig });
  }

  async addJob(taskId: string, data: any) {
    await this.queue.add("execute-workflow", data, {
      jobId: taskId, // Idempotency key
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });
  }
}

