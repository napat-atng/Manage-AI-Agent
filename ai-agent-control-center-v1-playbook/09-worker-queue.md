# Phase 09 — Worker Queue

## Goal
นำ task workflow execution ไปทำใน BullMQ worker ที่ retry/idempotent ได้.

## Scope
Queue definitions, producers, worker lifecycle, task state machine, retry/DLQ and graceful shutdown.

## Prerequisites / dependencies
Phase 03, 04 and 08 complete.

## Exact tasks
- [ ] สร้าง queues `task-execution`, `outbox-dispatch` with shared config in `packages/config`.
- [ ] API/service producer writes task + outbox in DB transaction then dispatches safely.
- [ ] worker claims task with idempotency key and validates allowed state transition.
- [ ] configure exponential backoff, bounded attempts, failure classification and dead-letter visibility.
- [ ] implement SIGTERM drain, Redis reconnect handling and stale-run recovery job.

## Files/folders ที่ต้องสร้างหรือแก้
`apps/worker/src/**`, `packages/config/src/queue.*`, `docs/worker.md`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/worker dev`; `pnpm --filter @aacc/worker test`

## Implementation guidance
BullMQ delivery is at-least-once: DB run/step transitions must be idempotent. Never hold a database transaction during model generation. Only a committed outbox record may produce a public event/job.

## Acceptance criteria
duplicate job does not duplicate side effects, retry resumes safely, and terminal task states are persisted with useful error class.

## Verification commands/tests
integration test Redis queue, forced worker crash/retry, duplicate message and graceful shutdown.

## Common pitfalls
อย่า rely on queue order, อย่า retry non-retryable validation/security errors, อย่า leave task permanently `running`.

## Definition of done
Worker can process a queued sample workflow through completion and recovery.

## Handoff prompt template
```text
Implement Phase 09 from 09-worker-queue.md. Add BullMQ task/outbox queues and an idempotent, recoverable worker around the workflow runtime. Test duplicate delivery, retries, shutdown, and stale-run recovery.
```
