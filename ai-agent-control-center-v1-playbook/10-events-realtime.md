# Phase 10 — Events & Realtime

## Goal
ส่ง live task updates ด้วย persisted ordered events, Redis Pub/Sub และ SSE replay.

## Scope
Event writer, outbox publisher, channel design, SSE endpoint handler and resume semantics.

## Prerequisites / dependencies
Phase 03, 04 and 09 complete.

## Exact tasks
- [ ] สร้าง `packages/events` implement `EventPublisher` backed by DB + outbox + Redis Pub/Sub.
- [ ] allocate per-task `sequence` transactionally and persist before publish.
- [ ] consume outbox idempotently; publish channel `task:<taskId>` after DB commit.
- [ ] implement SSE `/api/v1/tasks/:taskId/events?after=<sequence>` with ownership hook, keepalive and reconnect.
- [ ] replay DB events where sequence `> after`, then subscribe without gap; define `event:`/`id:` format.

## Files/folders ที่ต้องสร้างหรือแก้
`packages/events/src/**`, `apps/api/src/realtime/**`, `docs/events.md`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/events test`; `curl -N 'http://localhost:<api-port>/api/v1/tasks/<id>/events?after=0'`

## Implementation guidance
SSE is delivery convenience; database is truth. Use a subscribe-before-catchup or sequence recheck pattern to avoid race gaps. Bound replay window and return typed resync error when client is too far behind.

## Acceptance criteria
events persist once with monotonic sequence, two clients receive live event, reconnect with `after` gets exactly missed ordered records.

## Verification commands/tests
integration tests for rollback/no publish, replay, concurrent event insert, reconnect and Pub/Sub outage.

## Common pitfalls
อย่า use Redis Pub/Sub as durable store, อย่า broadcast all users on one channel, อย่า forget response flush/heartbeat.

## Definition of done
UI/API consumers can reconstruct task progress from durable event stream.

## Handoff prompt template
```text
Implement Phase 10 from 10-events-realtime.md. Make DB events authoritative, publish through transactional outbox and Redis Pub/Sub, and expose ordered SSE replay via `?after=`. Add race/reconnect integration tests.
```
