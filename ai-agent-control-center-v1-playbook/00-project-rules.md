# Phase 00 — Project Rules

## Goal
กำหนด baseline ที่ทุก agent ใช้ตรงกันสำหรับ modular monolith + worker.

## Scope
Architecture decision record, conventions, environment policy และ definition ของ V1.

## Prerequisites / dependencies
ไม่มี

## Exact tasks
- [ ] สร้าง `docs/architecture.md`, `docs/decisions.md`, `.editorconfig`, `.env.example`.
- [ ] บันทึกว่า frontend คือ Next.js/PWA, API คือ Express, worker แยก process แต่ shared packages.
- [ ] บันทึก local default: Ollama ผ่าน LiteLLM; Langfuse เป็น optional.
- [ ] ระบุ Node LTS, pnpm และ Docker Compose version ที่ทีมใช้.
- [ ] กำหนด naming: UUID IDs, snake_case DB, camelCase TypeScript, `/api/v1` routes.

## Files/folders ที่ต้องสร้างหรือแก้
`docs/architecture.md`, `docs/decisions.md`, `.editorconfig`, `.env.example`, `README.md`

## Commands ที่ต้องรัน
`node --version`; `pnpm --version`; `docker compose version`

## Implementation guidance
Architecture ต้องอนุญาตให้เพิ่ม provider, agent, tool และ workflow version โดยไม่แก้ consumer contracts. เลือก UTC timestamps, money/token counts เป็น integer, และระบุ secret source เป็น environment only.

## Acceptance criteria
เอกสารระบุ component ownership, trust boundary, local run path และ decision ที่ต้องเลือกตามเครื่อง (CPU/GPU, Ollama model, ports) ชัดเจน.

## Verification commands/tests
ตรวจ `.env.example` ไม่มี secret จริง และทุก link ใน README เป็น relative.

## Common pitfalls
อย่าผูก UI กับ provider, อย่าใช้ paid API เป็น requirement, อย่าเก็บ prompt/secret ใน log แบบไม่มี redaction.

## Definition of done
ทีม review baseline แล้วและไม่มีคำถาม architecture ที่ block Phase 01.

## Handoff prompt template
```text
Implement Phase 00 from 00-project-rules.md in this repository. Preserve existing work, create only the listed baseline docs/config, use local-first defaults, run the verification commands, and report changed files plus results. Do not begin later phases.
```
