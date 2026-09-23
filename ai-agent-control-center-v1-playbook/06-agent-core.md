# Phase 06 — Agent Core

## Goal
สร้าง agent registry/version runtime ที่ compose model, prompt และ allowed tools ได้.

## Scope
Agent definition loading, system prompts, execution context, version pinning และ four initial agents.

## Prerequisites / dependencies
Phase 03–05 complete.

## Exact tasks
- [ ] สร้าง `packages/agent-core` implement `AgentDefinition` and agent executor.
- [ ] load immutable `agent_versions` by task-pinned version, not mutable agent row.
- [ ] เพิ่ม initial agents: `manager`, `researcher`, `coder`, `reviewer` with minimal explicit roles.
- [ ] compose system prompt, task context, model profile and allowed `AgentTool` descriptors.
- [ ] persist `agent_runs` lifecycle and model usage; emit domain hooks, not transport-specific events.

## Files/folders ที่ต้องสร้างหรือแก้
`packages/agent-core/src/**`, `packages/db/src/seeders/agents.*`, `docs/agents.md`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/agent-core test`; `pnpm --filter @aacc/db seed`

## Implementation guidance
Manager delegates and synthesizes; researcher collects evidence; coder proposes/edits through tools; reviewer evaluates. Prompts are versioned content, inputs require Zod validation, and run state is persisted before/after external calls.

## Acceptance criteria
ทุก initial agent load/run from version snapshot, cannot invoke unbound tools, and creates auditable `agent_runs`.

## Verification commands/tests
unit tests for registry, pinned version, denied tool and gateway failure paths.

## Common pitfalls
อย่า hardcode agent behavior in API, อย่า let prompt select arbitrary tools, อย่า mutate published version.

## Definition of done
Agent runtime is deterministic given version/config/input except model output.

## Handoff prompt template
```text
Implement Phase 06 from 06-agent-core.md. Build a version-pinned agent runtime and seed manager, researcher, coder, reviewer. Persist lifecycle/usage and enforce explicit tool binding. Include focused tests.
```
