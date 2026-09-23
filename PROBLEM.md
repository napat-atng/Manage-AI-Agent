# Project Blockers and Required Decisions

Created: 2026-09-23

## Confirmed baseline

- Repository root: `D:\Manage AI Agent`
- Architecture: approved as specified in `ai-agent-control-center-v1-playbook/00-project-rules.md`
- Node.js: `v24.15.0`
- Development ports: web `3000`, API `3001`, PostgreSQL `5432`, Redis `6379`, LiteLLM `4000`, Ollama `11434`
- Available processors: Intel Core i5-10300H and NVIDIA GeForce GTX 1650 Ti

## Blocker 1 — pnpm is not installed

Phase 01 requires pnpm to install workspace dependencies and run build, typecheck, lint,
and test commands. `pnpm --version` currently fails because the command is unavailable.

**Needed:** permission to install pnpm (recommended: pnpm 10 via Corepack) or an
existing pnpm installation made available on PATH.

## Blocker 2 — Docker Compose is not installed

Phase 02 and later require Docker Compose to run PostgreSQL, Redis, LiteLLM, and Ollama.
`docker compose version` currently fails because Docker is unavailable.

**Needed:** permission to install Docker Desktop with Docker Compose, or a preinstalled
Docker Engine/Compose environment made available to this workspace.

## Decision 3 — Default Ollama model

No model is installed yet. The selected model must be documented before the infrastructure
phase and pulled only after Docker/Ollama is available.

**Suggested default:** `qwen2.5:3b`, because it is practical for local development on a
GTX 1650 Ti-class laptop GPU while retaining a CPU fallback. GPU use will remain optional.

**Needed:** approval of this model or a different model name.

## Note — Git repository

`D:\Manage AI Agent` is not currently a Git repository. Git initialization is not required
for Phase 00 documentation, but should be explicitly authorized before it is performed.
