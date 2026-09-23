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

**Resolved for repository commands — 2026-09-23.** pnpm `12.5.1` is installed through
Corepack and the repository invokes it through `corepack pnpm`.

PowerShell execution policy prevents the user-level `pnpm.ps1` shim from running, so direct
PowerShell use should be `pnpm.cmd` after restarting the terminal, or `corepack pnpm`.

## Blocker 2 — Docker Compose is not installed

**Resolved — 2026-09-23.** Docker Desktop 4.91.0 and Docker Compose `v5.5.1` are active and running with the WSL2 Linux engine. `docker compose version` and `docker ps` run successfully. Local infrastructure containers can now be launched and verified.

## Decision 3 — Default Ollama model

No model is installed yet. The selected model must be documented before the infrastructure
phase and pulled only after Docker/Ollama is available.

**Approved default:** `qwen2.5:3b`. It is practical for local development on a GTX 1650
Ti-class laptop GPU while retaining a CPU fallback. GPU use will remain optional.

## Note — Git repository

`D:\Manage AI Agent` is connected to the GitHub repository
`https://github.com/napat-atng/Manage-AI-Agent.git`. Commit each completed phase.
