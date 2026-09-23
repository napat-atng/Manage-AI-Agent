# Phase 08 — Workflow Engine

## Goal
compile versioned workflow definitions into LangGraph.js execution graphs.

## Scope
Workflow validation/compiler, state model, node handlers, approval interrupt/resume and persistence boundary.

## Prerequisites / dependencies
Phase 04, 06 and 07 complete.

## Exact tasks
- [ ] สร้าง `packages/workflow-engine` with Zod definition validation and compiler interface.
- [ ] implement nodes `agent`, `tool`, `condition`, `approval`, `transform` with explicit input/output mappings.
- [ ] define typed graph state: task ID, workflow version ID, step state, artifacts, message refs and correlation IDs.
- [ ] persist `task_steps` before/after each node; pin `workflow_versions` when task starts.
- [ ] implement suspend/resume for approval with idempotency keys and test sample workflow.

## Files/folders ที่ต้องสร้างหรือแก้
`packages/workflow-engine/src/**`, `docs/workflows.md`, `examples/manager-review.workflow.json`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/workflow-engine test`; `pnpm --filter @aacc/workflow-engine typecheck`

## Implementation guidance
Compiler validates DAG/reachable end/no missing references before queueing. `condition` must be deterministic code/config, not freeform LLM routing in V1. `transform` accepts constrained declarative mappings. LangGraph checkpointing complements—not replaces—DB business records.

## Acceptance criteria
valid workflow compiles/runs, invalid graph rejects before execution, approval resumes exactly once, and steps are auditable.

## Verification commands/tests
unit fixtures for all node types, cycles, missing edges, denied approval, restart/resume.

## Common pitfalls
อย่า mutate workflow version mid-run, อย่า trust arbitrary JS transforms, อย่า use in-memory-only state.

## Definition of done
Workflow runtime executes V1 node union with durable task state.

## Handoff prompt template
```text
Implement Phase 08 from 08-workflow-engine.md using LangGraph.js. Validate and compile V1 graph definitions, persist every step, and support durable approval pause/resume. Include fixtures for all node types and invalid graphs.
```
