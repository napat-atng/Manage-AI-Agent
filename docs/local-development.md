# Local Development

## Prerequisites

- Node.js `v24.15.0`
- pnpm `12.5.1`
- Docker Compose `v5.5.1`
- Optional NVIDIA GPU support for Ollama; CPU operation remains supported.

## Configuration

Copy `.env.example` to `.env.local`. Do not commit `.env.local`. The standard local ports are
web `3000`, API `3001`, PostgreSQL `5432`, Redis `6379`, LiteLLM `4000`, and Ollama `11434`.

## Model

After Phase 02 has added the Compose stack and Ollama is available, pull the approved model:

```text
ollama pull qwen2.5:3b
```

GPU use is an optional Docker profile/configuration. Do not make GPU availability a runtime
requirement.

## Current status

The target pnpm and Docker Compose commands are not yet available on this host, so workspace
installation and infrastructure startup cannot yet be verified. See `PROBLEM.md`.
