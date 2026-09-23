# Local Development

## Prerequisites

- Node.js `v24.15.0`
- pnpm `12.5.1`
- Docker Compose `v5.5.1`
- Optional NVIDIA GPU support for Ollama; CPU operation remains supported.

## Configuration

Copy `.env.example` to `.env.local` or `.env`. Do not commit secret values. The standard local ports are:

- Web: `3000`
- API: `3001`
- PostgreSQL: `5432`
- Redis: `6379`
- LiteLLM: `4000`
- Ollama: `11434`

## Starting Local Infrastructure

Run the Docker Compose stack:

```bash
docker compose up -d
```

Verify service status and health:

```bash
docker compose ps
```

All four services (`postgres`, `redis`, `ollama`, `litellm`) include health checks.

## Model Setup

Pull the approved default model (`qwen2.5:3b`) into Ollama:

```bash
docker compose exec ollama ollama pull qwen2.5:3b
```

LiteLLM routes completions to Ollama's `qwen2.5:3b` by default. You can test the LiteLLM health endpoint:

```bash
curl http://localhost:4000/health/liveliness
```

## CPU vs. GPU Operation

By default, the stack runs Ollama in CPU mode, which is portable across all development hosts. On machines with NVIDIA GPUs, Docker Desktop can expose the GPU to Ollama when configured with NVIDIA Container Toolkit runtime support. CPU fallback is always preserved and remains the standard baseline.
