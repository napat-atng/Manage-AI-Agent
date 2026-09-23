# Phase 15 — PWA & Mobile

## Goal
ทำ dashboard ติดตั้งได้และใช้งาน task monitoring บนมือถือได้ดี.

## Scope
Web manifest, icons, service worker strategy, responsive UI and mobile reliability boundaries.

## Prerequisites / dependencies
Phase 13 complete.

## Exact tasks
- [ ] add valid manifest, icons, theme colors and install metadata for Next.js.
- [ ] make task create/detail/approval responsive and keyboard/touch accessible.
- [ ] cache static shell safely; keep task data network-first and state its offline limitation.
- [ ] preserve SSE reconnect after visibility/network change; provide manual refresh.
- [ ] test installability and mobile viewport behavior.

## Files/folders ที่ต้องสร้างหรือแก้
`apps/web/public/**`, `apps/web/app/manifest.*`, `apps/web/**`, `docs/pwa.md`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/web build`; run Lighthouse/PWA audit where available.

## Implementation guidance
Do not claim offline workflow execution. Service worker must not cache authenticated API responses unless per-user isolation is rigorously designed; V1 should avoid it. Use progressive enhancement when SSE unavailable.

## Acceptance criteria
app is installable, no horizontal overflow at 360px, task status recovers after app resume, and sensitive API responses are not shared cache entries.

## Verification commands/tests
production build, browser install check, responsive browser tests, service worker cache inspection.

## Common pitfalls
อย่า cache session responses, อย่า rely on background SSE, อย่า hide approval deadline on small screens.

## Definition of done
Mobile user can submit/monitor/approve a task securely in supported browser.

## Handoff prompt template
```text
Implement Phase 15 from 15-pwa-mobile.md. Make the existing Next.js dashboard installable and mobile-first while keeping authenticated task data network-first. Verify responsive behavior and PWA build/audit.
```
