# Blockers and Required Decisions

Created: 2026-09-23

## Blocker 1 — Target repository is not available

The workspace currently contains only this playbook directory. The Phase 00 files
(`docs/architecture.md`, `docs/decisions.md`, `.editorconfig`, `.env.example`, and
the target repository `README.md`) must be created in the AI Agent Control Center
repository, but its path or repository URL has not been provided.

**Needed:** the local path to the target repository, or permission to create a new
repository at a specified path.

## Blocker 2 — Architecture baseline needs approval before Phase 00

The playbook requires human approval before implementation starts. The required
baseline is:

- Next.js PWA frontend, Express API, and a separate Node worker process.
- pnpm TypeScript-strict monorepo with shared packages; contracts are the source of truth.
- PostgreSQL, Redis, LiteLLM, and Ollama; Ollama through LiteLLM is the local default.
- UUID IDs, snake_case database names, camelCase TypeScript, `/api/v1` routes, UTC timestamps.
- Secrets only from environment variables; cloud providers and Langfuse are opt-in.

**Needed:** explicit approval or requested changes to this baseline.

## Decision 3 — Environment-dependent defaults

The plans require documented choices for Node LTS version, pnpm version, Docker Compose,
CPU/GPU mode, Ollama model, and service ports. These cannot be selected safely without
the target machine/team standard.

**Needed:** team standards or permission to propose practical local-development defaults.

## Decision 4 — External operations

Later phases require Docker services, an Ollama model download, and possibly browser/PWA
checks. These operations should only be run after the repository, selected model, host
resources, and intended local environment are confirmed.
