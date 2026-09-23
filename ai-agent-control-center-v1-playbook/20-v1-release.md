# Phase 20 — V1 Release

## Goal
ประกาศ V1 อย่างมีหลักฐาน พร้อม release notes, demo และ rollback decision.

## Scope
Final checklist, versioning, release candidate validation, docs, demo script and known limitations.

## Prerequisites / dependencies
Phase 00–19 complete.

## Exact tasks
- [ ] review `CHECKLIST.md` ทุก item และ link evidence (PR/test log/runbook) ใน repo release notes.
- [ ] freeze migrations/contracts/agent/workflow versions for release candidate.
- [ ] run full lint/typecheck/unit/integration/E2E/local smoke and record environment versions.
- [ ] prepare release notes: included capabilities, local setup, security constraints, known limitations and rollback.
- [ ] perform demo: login, create manager workflow, SSE updates, approval, result, failure/retry and event replay.

## Files/folders ที่ต้องสร้างหรือแก้
`CHANGELOG.md`, `docs/release-v1.md`, `docs/demo-v1.md`, release tag metadata as repository policy allows.

## Commands ที่ต้องรัน
`pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm e2e`; `docker compose ps`

## Implementation guidance
Do not add features during release. List deferred items honestly: multi-tenancy scale-out, arbitrary command execution, cloud provider defaults and offline execution are not V1 promises. Tag only after the exact commit passed suite.

## Acceptance criteria
new operator follows docs and completes demo; all required suites pass; rollback and known limitations are approved.

## Verification commands/tests
execute release command matrix from clean clone or disposable environment; archive non-sensitive evidence.

## Common pitfalls
อย่า tag untested commit, อย่า hide security limitations, อย่า change schema after final migration verification.

## Definition of done
V1 release candidate is accepted, reproducible, documented and safe to hand to first users.

## Handoff prompt template
```text
Execute Phase 20 from 20-v1-release.md as a release steward. Do not add product features. Verify the full matrix, produce concise release/demo/limitations documentation, and report exact pass/fail evidence plus any release blockers.
```
