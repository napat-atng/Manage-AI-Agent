# AI Agent Control Center

Local-first AI Agent Control Center V1. The system provides a Next.js PWA dashboard,
an Express API, and a separate worker process over shared TypeScript packages.

## Architecture baseline

- Local model inference uses Ollama through LiteLLM, with `qwen2.5:3b` as the default.
- PostgreSQL stores durable application state; Redis supports queueing and live delivery.
- Public API routes are versioned under `/api/v1`.
- Secrets are supplied only through environment variables and must never be committed.

See the project documentation:

- [Architecture](docs/architecture.md)
- [Decisions](docs/decisions.md)
- [Local development](docs/local-development.md)
- [Implementation playbook](ai-agent-control-center-v1-playbook/README.md)

## Required tooling

- Node.js `v24.15.0`
- pnpm `12.5.1`
- Docker Compose `v5.5.1`

Copy `.env.example` to `.env.local` and set only local, non-committed values there.
Installation and runtime verification are recorded in [PROBLEM.md](PROBLEM.md) until the
required tools are installed.
