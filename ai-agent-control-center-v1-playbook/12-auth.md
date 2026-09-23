# Phase 12 — Authentication & Authorization

## Goal
ปกป้อง API/task data ด้วย session authentication และ ownership/RBAC minimum.

## Scope
Users/sessions, login/logout/current user, password policy for local deployment, auth middleware and authorization services.

## Prerequisites / dependencies
Phase 03, 04 and 11 complete.

## Exact tasks
- [ ] select local auth mode: bootstrap admin + password (default) and document optional OIDC extension point.
- [ ] implement hashed passwords using maintained password library; never store plaintext.
- [ ] create session issuance, rotation, expiry/revocation, secure HttpOnly cookie and CSRF policy appropriate to deployment.
- [ ] add `GET /api/v1/me`, login/logout endpoints, `requireUser`, `requireRole`, task ownership checks.
- [ ] seed/bootstrap admin only via explicit environment setup flow and audit auth events.

## Files/folders ที่ต้องสร้างหรือแก้
`packages/auth/src/**`, `apps/api/src/auth/**`, `docs/auth.md`, `.env.example`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/auth test`; `pnpm --filter @aacc/api test`

## Implementation guidance
Start roles `admin`, `member`; authorize service layer, not only routes. Cookie flags depend on local HTTP vs production HTTPS and must be documented. Rate-limit login in Phase 16 at latest.

## Acceptance criteria
unauthenticated access fails, users cannot read/approve another user's task, revoked session fails immediately.

## Verification commands/tests
integration tests for login, expiry, logout/revocation, role denial and cross-user task/event denial.

## Common pitfalls
อย่า put tokens in localStorage, อย่า log credentials/session IDs, อย่า ship known bootstrap password.

## Definition of done
All non-health `/api/v1` data routes require and enforce a principal.

## Handoff prompt template
```text
Implement Phase 12 from 12-auth.md with local session auth, secure password storage, ownership and minimal RBAC. Add negative integration tests. Document the production HTTPS/CSRF requirements and avoid cloud identity dependency.
```
