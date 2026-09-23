# Phase 19 — Production Hardening

## Goal
เตรียม deployment ที่ operate/recover ได้สำหรับ single-host V1 ก่อน scale-out.

## Scope
Production Compose/containers, config validation, migrations, backup/restore, limits, health/readiness and runbooks.

## Prerequisites / dependencies
Phase 14 and 16–18 complete.

## Exact tasks
- [ ] create production environment checklist and validate all required variables at startup.
- [ ] build minimal non-root images; set resource limits, restart policy, health/readiness endpoints.
- [ ] make DB migration a deliberate deployment step, never auto-run concurrently by every replica.
- [ ] document Postgres backup, restore drill, Redis durability expectations and volume location.
- [ ] add operational runbooks for queue stuck, model unavailable, event lag, rollback and secret rotation.

## Files/folders ที่ต้องสร้างหรือแก้
`Dockerfile*`, `docker-compose.production.yml` or deployment docs, `docs/runbooks/**`, `docs/deployment.md`

## Commands ที่ต้องรัน
`docker compose -f docker-compose.yml -f docker-compose.production.yml config`; image build commands; backup/restore drill commands.

## Implementation guidance
Start with one API and one worker unless concurrency proven. Use reverse proxy/TLS outside app container; no public Redis/Postgres. Resource controls must be chosen for host and written in deployment record.

## Acceptance criteria
fresh deployment, restart recovery, backup/restore drill and controlled rollback succeed; readiness fails appropriately when critical dependencies unavailable.

## Verification commands/tests
validate merged compose config, build images, simulate restart, run restore to disposable DB, execute runbook tabletop.

## Common pitfalls
อย่า treat Compose as automatic HA, อย่า skip restore test, อย่า bake secrets into image.

## Definition of done
Operator has reproducible deployment and recovery instructions tailored to actual host.

## Handoff prompt template
```text
Implement Phase 19 from 19-production-hardening.md. Prepare single-host production artifacts and explicit operational runbooks, validate configuration and perform a disposable backup/restore/restart drill. Do not claim HA or cloud dependencies.
```
