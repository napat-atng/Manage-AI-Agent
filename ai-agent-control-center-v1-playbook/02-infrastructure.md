# Phase 02 — Infrastructure

## Goal
ให้ local infrastructure รันซ้ำได้ด้วย Docker Compose โดยไม่มี paid dependency.

## Scope
PostgreSQL, Redis, LiteLLM, Ollama, named volumes, health checks และ environment examples.

## Prerequisites / dependencies
Phase 01 complete; Docker Desktop/Engine พร้อมใช้งาน.

## Exact tasks
- [ ] สร้าง `docker-compose.yml` กับ services `postgres`, `redis`, `litellm`, `ollama`.
- [ ] เพิ่ม health checks, persistent named volumes, internal network และ non-secret default ports.
- [ ] mount LiteLLM config ที่ชี้ Ollama model จาก environment.
- [ ] เพิ่ม `infra/litellm/config.yaml`, `infra/postgres/init/`, `.env.example`.
- [ ] บันทึกวิธี pull model (`ollama pull <chosen-model>`) และทางเลือก CPU/GPU ใน docs.

## Files/folders ที่ต้องสร้างหรือแก้
`docker-compose.yml`, `infra/litellm/config.yaml`, `infra/postgres/init/`, `.env.example`, `docs/local-development.md`

## Commands ที่ต้องรัน
`docker compose up -d`; `docker compose ps`; `docker compose logs --tail=100 litellm`

## Implementation guidance
Postgres ใช้ volume และ database/user จาก `.env`; Redis ต้องเปิดเฉพาะ compose network. LiteLLM API key ใน local dev อาจเป็น dev-only placeholder; production ต้อง inject secret. Ollama GPU config ต้องเป็น profile/optional ไม่ใช่ requirement.

## Acceptance criteria
ทุก service healthy, LiteLLM เรียก local Ollama model ได้หลัง pull model, และ restart แล้ว data volumes ยังอยู่.

## Verification commands/tests
`docker compose ps`; `curl http://localhost:<litellm-port>/health`; `docker compose down` แล้ว `up -d`.

## Common pitfalls
อย่า expose Postgres/Redis สู่ public network, อย่า commit model credentials, อย่าบังคับ GPU.

## Definition of done
นักพัฒนาคนใหม่รัน stack ตาม docs ได้จาก clean checkout.

## Handoff prompt template
```text
Implement Phase 02 from 02-infrastructure.md. Build a local-first Docker Compose stack with documented Ollama model setup and health checks. Do not add cloud providers. Verify service health and report selected ports/models.
```
