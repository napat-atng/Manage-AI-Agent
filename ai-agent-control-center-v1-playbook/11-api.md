# Phase 11 — API

## Goal
สร้าง Express API `/api/v1` ที่ validated, consistent และพร้อม dashboard.

## Scope
Routes/controllers/services, Zod middleware, error mapping, request logging and OpenAPI artifact.

## Prerequisites / dependencies
Phase 04, 09 and 10 complete.

## Exact tasks
- [ ] add Express app bootstrap, health/readiness endpoints and Pino request context.
- [ ] implement `POST /api/v1/tasks`, `GET /api/v1/tasks`, `GET /api/v1/tasks/:id`, `POST /api/v1/tasks/:id/approve`.
- [ ] implement read/create/update version routes for agents, workflows, model profiles and tools as V1 needs.
- [ ] expose `GET /api/v1/tasks/:id/events?after=` through realtime module.
- [ ] validate body/query/params with contracts; return standard error envelope and documented status codes.

## Files/folders ที่ต้องสร้างหรือแก้
`apps/api/src/{routes,controllers,services,middleware}`, `docs/api.md`, `openapi.yaml`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/api test`; `pnpm --filter @aacc/api dev`

## Implementation guidance
Task creation pins workflow/agent versions and returns `202 Accepted` with task ID. Keep controllers thin. Use pagination/cursor for lists. Authentication middleware can initially be injectable but must be enforced in Phase 12 before product UI.

## Acceptance criteria
happy/invalid API requests have contract-conformant responses, task is queued after commit, SSE route uses same ownership service hook.

## Verification commands/tests
Supertest integration tests for all routes, schema failures, error mapping and OpenAPI lint if configured.

## Common pitfalls
อย่า return stack traces, อย่า create task before validation, อย่า let route accept mutable version ambiguity.

## Definition of done
API supports full V1 control flow without UI-specific logic.

## Handoff prompt template
```text
Implement Phase 11 from 11-api.md. Build contract-validated Express `/api/v1` endpoints, queue task creation transactionally, add docs/OpenAPI, and test happy plus failure cases. Keep auth hook-ready; do not fake authorization.
```
