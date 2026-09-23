# Project Blockers and Required Decisions

Created: 2026-09-23

## Confirmed baseline

- Repository root: `D:\Manage AI Agent`
- Architecture: approved as specified in `ai-agent-control-center-v1-playbook/00-project-rules.md`
- Node.js: `v24.15.0`
- Target pnpm version: `12.5.1`
- Target Docker Compose version: `v5.5.1`
- Development ports: web `3000`, API `3001`, PostgreSQL `5432`, Redis `6379`, LiteLLM `4000`, Ollama `11434`
- Available processors: Intel Core i5-10300H and NVIDIA GeForce GTX 1650 Ti

## Blocker 1 — pnpm is not installed

Phase 01 requires pnpm to install workspace dependencies and run build, typecheck, lint,
and test commands. `pnpm --version` currently fails because the command is unavailable.

**Needed:** pnpm `12.5.1` installed and made available on PATH.

## Blocker 2 — Docker Compose is not installed

Phase 02 and later require Docker Compose to run PostgreSQL, Redis, LiteLLM, and Ollama.
`docker compose version` currently fails because Docker is unavailable.

**Needed:** Docker Compose `v5.5.1` installed and made available to this workspace.

## Decision 3 — Default Ollama model

No model is installed yet. The selected model must be documented before the infrastructure
phase and pulled only after Docker/Ollama is available.

**Approved default:** `qwen2.5:3b`. It is practical for local development on a GTX 1650
Ti-class laptop GPU while retaining a CPU fallback. GPU use will remain optional.

## Note — Git repository

`D:\Manage AI Agent` is connected to the GitHub repository
`https://github.com/napat-atng/Manage-AI-Agent.git`. Commit each completed phase.
