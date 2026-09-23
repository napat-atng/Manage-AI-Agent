# Architecture

## V1 topology

AI Agent Control Center is a local-first modular monolith with a separate worker process:

- `apps/web`: Next.js PWA dashboard for authenticated task creation and monitoring.
- `apps/api`: Express API that owns HTTP boundaries, validation, authorization, and SSE.
- `apps/worker`: Node.js worker that executes queued workflows outside the API process.
- `packages/*`: shared, dependency-directed TypeScript modules. Apps depend on packages;
  packages never depend on apps. `packages/contracts` is the source of truth for public
  request, response, and event schemas.

## Data and execution boundaries

PostgreSQL is the durable source of truth for users, versions, tasks, steps, runs, events,
and outbox records. Redis supports BullMQ queues and Pub/Sub only; it is not a durable event
store. Every mutation that must notify a client writes an outbox record in the same database
transaction. Events are append-only and have a monotonic sequence per task, enabling replay.

The worker receives at-least-once queue delivery and must make state transitions idempotent.
It calls models only through the `ModelGateway` contract. The gateway uses LiteLLM's
OpenAI-compatible API, and LiteLLM routes the local default model to Ollama.

## Trust boundaries

Browser input, model output, tool arguments, HTTP input, queue messages, and provider
responses are untrusted. Zod validates data at external boundaries. Tool access is bounded
to an explicitly configured workspace and policy; arbitrary shell execution is not a V1
capability. Secrets originate only from environment variables or an approved secret store,
and logs must redact sensitive values and prompt content by default.

## Conventions

- IDs: UUID.
- Database: `snake_case` tables and columns.
- TypeScript: `camelCase` names and strict compiler settings.
- API: `/api/v1` prefix and contract-defined error envelopes.
- Time: ISO-8601 UTC timestamps.
- Token counts and money: integers; unknown cost is represented as `null`.

## Local run path

1. Install the versions in `README.md`.
2. Copy `.env.example` to `.env.local` and set local secrets without committing them.
3. Start PostgreSQL, Redis, LiteLLM, and Ollama through Docker Compose.
4. Pull `qwen2.5:3b` into Ollama.
5. Run database migrations/seeds, then start web, API, and worker processes.

The executable Compose and application commands are added in later phases. Until then, see
`PROBLEM.md` for installation blockers.
