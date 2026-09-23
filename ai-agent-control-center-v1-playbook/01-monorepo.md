# Phase 01 — Monorepo

## Goal
ตั้ง pnpm workspace ที่ build/typecheck apps และ packages ได้แบบ shared contracts.

## Scope
Workspace tooling, TypeScript base config, lint/format scripts และ empty runtime entrypoints.

## Prerequisites / dependencies
Phase 00 complete.

## Exact tasks
- [ ] สร้าง `apps/web`, `apps/api`, `apps/worker` และ `packages/{contracts,config,db,agent-core,workflow-engine,llm,tools,events,auth,observability}`.
- [ ] เพิ่ม `pnpm-workspace.yaml`, root `package.json`, `tsconfig.base.json`, shared lint/format config.
- [ ] ให้ทุก package มี `package.json`, `src/index.ts`, strict TypeScript และ explicit exports.
- [ ] ให้ web ใช้ Next.js, api ใช้ Express, worker เป็น Node service; ยังไม่ใส่ business logic.
- [ ] เพิ่ม scripts `dev`, `build`, `typecheck`, `lint`, `test` ที่เรียก recursive packages.

## Files/folders ที่ต้องสร้างหรือแก้
`apps/*`, `packages/*`, `pnpm-workspace.yaml`, `package.json`, `tsconfig.base.json`

## Commands ที่ต้องรัน
`pnpm install`; `pnpm typecheck`; `pnpm build`; `pnpm lint`

## Implementation guidance
ใช้ workspace aliases ผ่าน package exports ไม่ใช่ relative imports ข้าม package. ระบุ dependency direction: apps → packages; packages ห้าม import apps; contracts/config อยู่ล่างสุด.

## Acceptance criteria
Clean install, typecheck และ build ผ่าน; web/api/worker start เป็น skeleton ได้.

## Verification commands/tests
`pnpm -r typecheck`; `pnpm -r build`; `pnpm lint`

## Common pitfalls
อย่า duplicate types ระหว่าง apps, อย่าให้ `db` import Express/BullMQ, อย่าใช้ unpinned latest runtime.

## Definition of done
Folder layout ตรง architecture และทุก workspace resolve dependency ได้.

## Handoff prompt template
```text
Implement only Phase 01 from 01-monorepo.md. Establish the pnpm TypeScript monorepo and empty application/package entrypoints, then run install, typecheck, build, and lint. Report failures without expanding scope.
```
