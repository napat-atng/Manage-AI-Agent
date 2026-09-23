# Phase 16 — Security & Sandbox

## Goal
ทำ threat controls ที่จำเป็นก่อน V1 ใช้กับไฟล์/command จริง.

## Scope
Tool sandbox hardening, secrets, rate limits, CSRF/CORS/headers, audit and security tests.

## Prerequisites / dependencies
Phase 07, 11 and 12 complete.

## Exact tasks
- [ ] write threat model for model input, tool calls, filesystem, command execution, events and sessions.
- [ ] enforce workspace allowlist/canonical path revalidation and per-tool resource limits.
- [ ] restrict `run_tests` to explicit safe commands; run in unprivileged isolated runtime where supported.
- [ ] add rate limits for login/task create/SSE and secure CORS, CSRF, cookie/header policies.
- [ ] implement secret redaction/scanning safeguards, audit actor/task/tool metadata and incident disable switch.

## Files/folders ที่ต้องสร้างหรือแก้
`docs/threat-model.md`, `apps/api/src/security/**`, `packages/tools/src/**`, `packages/config/src/security.*`

## Commands ที่ต้องรัน
`pnpm -r test`; run dependency/security audit available to the package manager.

## Implementation guidance
Local-first is not permission-free: model outputs are untrusted. Disable writes/commands by policy until user explicitly enables the workspace. Document platform limitations; container isolation is preferred for untrusted repositories but not silently assumed.

## Acceptance criteria
adversarial path/command/session tests pass, sensitive fields redact, rate limit works, and operator can disable dangerous tools without deploy.

## Verification commands/tests
automated traversal/symlink/command injection/CSRF/CORS/rate-limit tests; manually inspect production headers.

## Common pitfalls
อย่า trust LLM tool arguments, อย่า use denylist-only shell security, อย่า expose error internals through SSE.

## Definition of done
Security review finds no known unbounded host-file or arbitrary-command path in V1.

## Handoff prompt template
```text
Implement Phase 16 from 16-security-sandbox.md. Harden the existing tool/API boundaries, document threats and limitations, and add adversarial tests. Preserve local-first operation but require explicit policy for sensitive capabilities.
```
