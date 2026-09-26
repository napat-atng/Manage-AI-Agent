
import { Worker, Job } from "bullmq";
import { WorkflowRuntime } from "@aacc/workflow-engine";
import { UUIDSchema } from "@aacc/contracts";

export class TaskProcessor {
  constructor(private runtime: WorkflowRuntime) {}

  async start() {
    const worker = new Worker("task-execution", async (job: Job) => {
      await this.processJob(job);
    }, { 
      connection: { host: "localhost", port: 6379 } 
    });

    worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
    worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed: ${err.message}`));
  }

  private async processJob(job: Job) {
    const { taskId, workflowDefinition, startNodeId, state } = job.data;

    try {
      let currentNodeId = startNodeId;
      let currentState = state;

      while (currentNodeId) {
        const result = await this.runtime.executeStep(taskId, workflowDefinition, currentNodeId, currentState);
        currentNodeId = result.nextNodeId;
        currentState = result.newState;
      }

      console.log(`Task ${taskId} finished successfully.`);
    } catch (error: any) {
      if (error.message === "SUSPEND_FOR_APPROVAL") {
        console.log(`Task ${taskId} suspended for approval.`);
        // In a real system, we would update DB status to "awaiting_approval"
        return; 
      }
      throw error; // BullMQ will trigger retry
    }
  }
}

