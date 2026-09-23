# Phase 07 — Tools

## Goal
ทำ filesystem/git/test tools ที่ปลอดภัย ตรวจสอบได้ และไม่หลุด workspace.

## Scope
`read_file`, `write_file`, `list_files`, `search_files`, `git_status`, `git_diff`, `run_tests` plus policy/audit.

## Prerequisites / dependencies
Phase 04 and 06 complete.

## Exact tasks
- [ ] สร้าง `packages/tools` with `AgentTool` implementations and Zod input/output schemas.
- [ ] Resolve canonical paths against configured workspace root; reject traversal, symlink escape and absolute external paths.
- [ ] limit file size/result count/search scope; redact likely secrets from output/logs.
- [ ] implement command allowlist for `run_tests`, controlled cwd, timeout, output cap and exit-code capture.
- [ ] persist `tool_runs` and tool call result metadata; bind tools using `agent_tools`.

## Files/folders ที่ต้องสร้างหรือแก้
`packages/tools/src/**`, `packages/config/src/tool-policy.*`, `docs/tools.md`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/tools test`; `pnpm --filter @aacc/tools lint`

## Implementation guidance
V1 must never execute arbitrary shell text. `write_file` uses atomic write inside allowed root. Tools return structured results, not raw uncontrolled terminal output. Approval requirement belongs to workflow `approval` node, not a hidden tool bypass.

## Acceptance criteria
seven tools function in fixture repo; traversal/unsafe command attempts fail; every invocation has an audit record.

## Verification commands/tests
test traversal, symlink, timeout, output truncation, allowed/disallowed command and atomic write paths.

## Common pitfalls
อย่า accept glob/cwd from model without validation, อย่า log file contents by default, อย่า run as host administrator.

## Definition of done
Tool surface is least-privilege, bounded, tested and usable by agent-core.

## Handoff prompt template
```text
Implement Phase 07 from 07-tools.md. Build exactly the seven bounded tools, canonical workspace isolation, an allowlisted test runner, and audited tool runs. Add adversarial security tests; do not add arbitrary shell execution.
```
