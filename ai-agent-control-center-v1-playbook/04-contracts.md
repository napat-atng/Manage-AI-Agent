# Phase 04 — Contracts

## Goal
สร้าง shared typed boundary สำหรับ API, events, workflow และ agent interfaces.

## Scope
Zod schemas, inferred TypeScript types, error envelope, ID/time primitives และ OpenAPI-ready route models.

## Prerequisites / dependencies
Phase 01 and 03 complete.

## Exact tasks
- [ ] เพิ่ม Zod schemas ใน `packages/contracts/src` แยก `api`, `entities`, `events`, `workflow`, `agents`.
- [ ] กำหนด `ApiSuccess`, `ApiError`, pagination, request ID และ ISO UTC timestamp schemas.
- [ ] สร้าง `AgentDefinition`, `ModelGateway`, `AgentTool`, `WorkflowEngine`, `WorkflowCompiler`, `EventPublisher` interfaces.
- [ ] กำหนด workflow node union: `agent`, `tool`, `condition`, `approval`, `transform`.
- [ ] กำหนด event envelope: `id`, `taskId`, `sequence`, `type`, `occurredAt`, `payload`, `correlationId`.

## Files/folders ที่ต้องสร้างหรือแก้
`packages/contracts/src/**`, `docs/contracts.md`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/contracts typecheck`; `pnpm --filter @aacc/contracts test`

## Implementation guidance
Schema ต้อง validate untrusted input/output at runtime; types derive จาก Zod, never hand-maintain duplicate interface. API errors มี stable machine code และ safe public message. Version event schema early (เช่น `eventVersion: 1`).

## Acceptance criteria
ทุก interface ที่ระบุ export ได้, invalid examples fail predictably, และ app ไม่มี locally duplicated DTO.

## Verification commands/tests
รัน unit tests ของ valid/invalid fixtures และ `pnpm -r typecheck`.

## Common pitfalls
อย่าใช้ `z.any()` ตรง public boundary, อย่ารั่ว internal error, อย่าส่ง DB model ตรง API.

## Definition of done
Contracts เป็น source of truth และ consumers compile against it.

## Handoff prompt template
```text
Implement Phase 04 from 04-contracts.md. Add Zod-first shared contracts and the listed core interfaces/node/event unions. Keep schemas reusable and test valid plus invalid fixtures. Do not implement runtime services yet.
```
