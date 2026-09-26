# V1 Master Checklist

สถานะ: เริ่มจาก Phase 0 ตามลำดับ; งานขนานได้เฉพาะเมื่อ dependencies ผ่านแล้ว.

| ลำดับ | Phase | Dependencies | Acceptance criteria แบบย่อ |
|---|---|---|---|
| [x] 0 | [00-project-rules.md](00-project-rules.md) | - | architecture, conventions, ADR baseline อนุมัติ |
| [x] 1 | [01-monorepo.md](01-monorepo.md) | 0 | apps/packages build และ typecheck ได้ |
| [x] 2 | [02-infrastructure.md](02-infrastructure.md) | 1 | Postgres, Redis, LiteLLM, Ollama พร้อม health checks |
| [x] 3 | [03-database.md](03-database.md) | 1,2 | Sequelize migrations และ core tables ครบ |
| [x] 4 | [04-contracts.md](04-contracts.md) | 1,3 | Zod contracts, shared IDs และ error envelope พร้อม |
| [x] 5 | [05-llm-gateway.md](05-llm-gateway.md) | 2,3,4 | LiteLLM routing + ModelGateway ใช้ Ollama ได้ |
| [x] 6 | [06-agent-core.md](06-agent-core.md) | 3,4,5 | agent/version/tool binding และ manager/researcher/coder/reviewer |
| [ ] 7 | [07-tools.md](07-tools.md) | 4,6 | 7 tools sandboxed, audited, policy-controlled |
| [ ] 8 | [08-workflow-engine.md](08-workflow-engine.md) | 4,6,7 | LangGraph compiler รองรับ 5 node types |
| [ ] 9 | [09-worker-queue.md](09-worker-queue.md) | 3,4,8 | BullMQ worker idempotent และ retry ได้ |
| [ ] 10 | [10-events-realtime.md](10-events-realtime.md) | 3,4,9 | persisted sequence + Pub/Sub + SSE replay `?after=` |
| [ ] 11 | [11-api.md](11-api.md) | 4,9,10 | `/api/v1` endpoints validated/documented |
| [ ] 12 | [12-auth.md](12-auth.md) | 3,4,11 | session auth, ownership, RBAC minimum |
| [ ] 13 | [13-web-dashboard.md](13-web-dashboard.md) | 4,11,12 | task submit, run status, event stream UI |
| [ ] 14 | [14-usage-observability.md](14-usage-observability.md) | 3,5,9,10 | Pino, metrics, usage, optional Langfuse |
| [ ] 15 | [15-pwa-mobile.md](15-pwa-mobile.md) | 13 | installable PWA and mobile task flow |
| [ ] 16 | [16-security-sandbox.md](16-security-sandbox.md) | 7,11,12 | path, command, rate, secret controls verified |
| [ ] 17 | [17-testing.md](17-testing.md) | 3-16 | unit/integration suites and fixtures reliable |
| [ ] 18 | [18-e2e.md](18-e2e.md) | 2-17 | local end-to-end happy/failure/replay flows pass |
| [ ] 19 | [19-production-hardening.md](19-production-hardening.md) | 14,16-18 | backups, limits, runbook, deploy checks ready |
| [ ] 20 | [20-v1-release.md](20-v1-release.md) | 0-19 | release checklist, tag candidate, demo accepted |

## Recommended order

ทำ `00→05` เป็น foundation, `06→10` เป็น execution platform, `11→16` เป็น product/security, และ `17→20` เป็น quality/release. Phase 13 กับ 14 เริ่มขนานได้หลัง Phase 12 และ 10 ตาม dependency table.

## Global acceptance criteria

- [ ] `docker compose up -d` ทำให้ local stack healthy โดยไม่ต้อง paid API.
- [ ] ผู้ใช้สร้าง task, worker รัน workflow, UI รับ SSE/replay และเห็น persisted result ได้.
- [ ] ทุก external boundary validate ด้วย Zod; ทุก event มี immutable sequence; logs ไม่มี secret.
- [ ] Test, lint, typecheck และ E2E ผ่านใน clean clone ตาม README ของ repo ที่สร้าง.
