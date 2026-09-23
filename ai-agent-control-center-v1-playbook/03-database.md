# Phase 03 — Database

## Goal
ออกแบบ Sequelize schema/migrations ที่รองรับ task execution, versioning และ durable events.

## Scope
PostgreSQL models, migrations, seed development data และ DB transaction utilities.

## Prerequisites / dependencies
Phase 01–02 complete.

## Exact tasks
- [ ] สร้าง Sequelize setup ใน `packages/db` พร้อม migration/seed scripts.
- [ ] สร้าง tables: `users`, `sessions`, `model_profiles`, `agents`, `agent_versions`, `tools`, `agent_tools`, `workflows`, `workflow_versions`.
- [ ] สร้าง execution tables: `tasks`, `task_steps`, `agent_runs`, `tool_runs`, `messages`, `events`, `outbox_jobs`.
- [ ] เพิ่ม UUID PK, `created_at`/`updated_at`, FK, indexes สำหรับ task/event replay และ unique version constraints.
- [ ] เพิ่ม transaction helper สำหรับ mutation + `outbox_jobs` insertion atomically.

## Files/folders ที่ต้องสร้างหรือแก้
`packages/db/src/{models,migrations,seeders}`, `packages/db/src/index.ts`, `docs/database.md`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/db migrate`; `pnpm --filter @aacc/db seed`

## Implementation guidance
`events` ต้องมี monotonic per-task `sequence` unique `(task_id, sequence)`; เก็บ JSONB payload with event type. `workflow_versions.definition` และ agent config เก็บ immutable snapshot JSONB. State transitions มี enum/check constraint และ index `events(task_id, sequence)`.

## Acceptance criteria
Migrate บน empty DB ได้, rollback ของ latest migration ได้, seed สร้าง initial agents/model profile ได้ และ duplicate event sequence ถูกปฏิเสธ.

## Verification commands/tests
`pnpm --filter @aacc/db migrate`; `pnpm --filter @aacc/db test`; ตรวจ schema ด้วย `psql` หรือ migration integration test.

## Common pitfalls
อย่าใช้ `sync()` แทน migrations, อย่าเก็บ password/api key plaintext, อย่าแก้ workflow version ที่ published แล้ว.

## Definition of done
Schema documented และมี migration จากศูนย์ครบทุก entity ที่กำหนด.

## Handoff prompt template
```text
Implement Phase 03 from 03-database.md using Sequelize migrations only. Include all stated entities, indexes, immutable version records, and atomic outbox support. Run migrations, seed, and focused tests; report schema decisions.
```
