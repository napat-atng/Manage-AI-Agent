
import { EventEnvelope, EventPublisher } from "@aacc/contracts";
import Redis from "ioredis";
import { UUIDSchema } from "@aacc/contracts";

export class DomainEventPublisher implements EventPublisher {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }

  /**
   * Publishes an event. 
   * Following the Outbox Pattern:
   * 1. The event is first persisted to the DB (handled by the service calling this).
   * 2. Once DB transaction is committed, this method publishes to Redis for real-time delivery.
   */
  async publish(event: EventEnvelope): Promise<void> {
    const channel = `task:${event.taskId}`;
    const payload = JSON.stringify(event);
    
    try {
      await this.redis.publish(channel, payload);
      console.log(`[EventPublisher] Published event ${event.type} to ${channel}`);
    } catch (error) {
      console.error(`[EventPublisher] Redis Publish Error: ${error}`);
      // We do not throw here because the event is already durable in the DB.
      // The SSE endpoint will replay it from DB upon reconnection.
    }
  }

  async subscribe(taskId: string, callback: (event: EventEnvelope) => void): Promise<void> {
    const sub = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
    });

    await sub.subscribe(`task:${taskId}`);
    sub.on("message", (channel, message) => {
      if (channel === `task:${taskId}`) {
        callback(JSON.parse(message));
      }
    });
  }
}

