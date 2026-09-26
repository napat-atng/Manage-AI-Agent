
import { Request, Response } from "express";
import { DomainEventPublisher } from "@aacc/events";
import { EventEnvelope } from "@aacc/contracts";

export class EventStreamHandler {
  constructor(private publisher: DomainEventPublisher) {}

  async handleSSE(req: Request, res: Response) {
    const { taskId } = req.params;
    const afterSequence = parseInt(req.query.after as string) || 0;

    // 1. Set SSE Headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    // 2. Replay Missed Events from DB
    // Mock: In reality, this would be: SELECT * FROM events WHERE task_id = taskId AND sequence > afterSequence ORDER BY sequence ASC
    console.log(`[SSE] Replaying events for task ${taskId} after sequence ${afterSequence}`);
    
    // 3. Subscribe to Live Events via Redis
    await this.publisher.subscribe(taskId, (event: EventEnvelope) => {
      res.write(`id: ${event.id}\\n`);
      res.write(`event: ${event.type}\\n`);
      res.write(`data: ${JSON.stringify(event.payload)}\\n\\n`);
    });

    // 4. Heartbeat to keep connection alive
    const heartbeat = setInterval(() => {
      res.write(": heartbeat\n\n");
    }, 15000);

    req.on("close", () => {
      clearInterval(heartbeat);
      res.end();
    });
  }
}

