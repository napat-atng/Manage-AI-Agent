# Phase 17 — Testing

## Goal
สร้าง test pyramid ที่เชื่อถือได้สำหรับ contracts, DB, services, worker และ UI.

## Scope
Test conventions, fixtures/factories, isolated databases/Redis, coverage gate and CI scripts.

## Prerequisites / dependencies
Phase 03–16 complete.

## Exact tasks
- [ ] define test layers: unit, integration, contract, component; reserve E2E for Phase 18.
- [ ] add deterministic factories for users, versions, tasks, events and tool fixture repos.
- [ ] isolate test Postgres/Redis via compose profile or ephemeral containers; no production DB.
- [ ] mock LLM at boundary and keep one opt-in local smoke test separate.
- [ ] wire root test commands, coverage report and test data cleanup.

## Files/folders ที่ต้องสร้างหรือแก้
`test/**`, `packages/*/test/**`, `apps/*/test/**`, `docs/testing.md`, CI configuration if repository uses it.

## Commands ที่ต้องรัน
`pnpm test`; `pnpm test:integration`; `pnpm test:coverage`

## Implementation guidance
Favor behavior over implementation snapshots. Integration tests must cover migration, transactional outbox and SSE boundaries. Fix flakes at source; retries must not hide nondeterminism.

## Acceptance criteria
test commands work from clean stack, fixtures do not leak across tests, critical state/security paths have coverage.

## Verification commands/tests
run all defined suites twice; validate test DB cleanup and report any intentionally excluded external smoke test.

## Common pitfalls
อย่า call paid/cloud LLM in CI, อย่า share mutable global state, อย่า set arbitrary coverage target without baseline.

## Definition of done
Test architecture is documented and gives fast feedback before E2E.

## Handoff prompt template
```text
Implement Phase 17 from 17-testing.md. Standardize deterministic unit/integration/component testing and isolated infrastructure, preserving existing tests. Run every suite twice to surface flakiness and report results.
```
