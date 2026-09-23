# Architecture Decisions

## ADR-001: Local-first runtime

**Status:** Accepted — 2026-09-23

V1 uses Ollama via LiteLLM as its default model path. Cloud model providers are opt-in through
environment configuration only. Langfuse is optional and must not block local operation.

## ADR-002: Application topology

**Status:** Accepted — 2026-09-23

The product is a pnpm TypeScript monorepo with a Next.js/PWA frontend, Express API, and
separate Node.js worker. Shared packages keep contracts and core capabilities independent of
application entrypoints.

## ADR-003: Durable state and event delivery

**Status:** Accepted — 2026-09-23

PostgreSQL is authoritative for business state and events. Redis is used for queueing and
transient Pub/Sub. Mutations write an outbox record transactionally; events are append-only
and replayable by per-task sequence.

## ADR-004: Development environment

**Status:** Accepted — 2026-09-23

The approved environment baseline is Node.js `v24.15.0`, pnpm `12.5.1`, and Docker Compose
`v5.5.1`. Development ports are: web `3000`, API `3001`, PostgreSQL `5432`, Redis `6379`,
LiteLLM `4000`, and Ollama `11434`.

## ADR-005: Default local model

**Status:** Accepted — 2026-09-23

The default Ollama model is `qwen2.5:3b`. GPU acceleration is optional; the application must
retain a CPU fallback. The initial development target has an Intel Core i5-10300H CPU and an
NVIDIA GeForce GTX 1650 Ti GPU.

## ADR-006: Security and naming conventions

**Status:** Accepted — 2026-09-23

Use UUID IDs, `snake_case` database naming, `camelCase` TypeScript naming, `/api/v1` routes,
and UTC timestamps. Secrets are environment-only and are never committed or logged without
redaction.
