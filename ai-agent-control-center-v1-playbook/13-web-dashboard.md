# Phase 13 — Web Dashboard

## Goal
ส่ง Next.js dashboard ที่ผู้ใช้สร้าง task และติดตาม execution ได้.

## Scope
Auth-aware UI, task list/detail/create, workflow/agent selection, SSE client and accessible error/loading states.

## Prerequisites / dependencies
Phase 04, 11 and 12 complete.

## Exact tasks
- [ ] implement login/session bootstrap and protected app layout.
- [ ] build task create form with workflow/version/model choices from API.
- [ ] build task list/detail showing status, steps, messages, tool/agent runs and approval action.
- [ ] implement SSE client with `lastSequence`, reconnect/backoff and REST refetch/resync handling.
- [ ] add clear user-facing state for queued/running/waiting approval/failed/completed.

## Files/folders ที่ต้องสร้างหรือแก้
`apps/web/app/**` or `apps/web/src/**`, `apps/web/components/**`, `docs/ui.md`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/web dev`; `pnpm --filter @aacc/web test`; `pnpm --filter @aacc/web build`

## Implementation guidance
Keep server state/query logic separate from presentational components. Never render tool output as unsafe HTML. UI should recover after tab reload by fetching persisted task first, then SSE `?after=lastSequence`.

## Acceptance criteria
authenticated user can create task, observe real-time sequence updates, approve paused run and see terminal result after refresh.

## Verification commands/tests
component tests for states; browser smoke using local API; production build.

## Common pitfalls
อย่า assume events never duplicate, อย่า keep secrets in browser config, อย่า block whole page on one stream failure.

## Definition of done
Dashboard covers primary V1 workflow without direct API tooling.

## Handoff prompt template
```text
Implement Phase 13 from 13-web-dashboard.md in Next.js. Build a focused authenticated task dashboard with resilient SSE replay/reconnect and approval UX. Use only API contracts; verify component and build tests.
```
