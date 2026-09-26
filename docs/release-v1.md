# Release Notes v1.0.0

## Summary
AI Agent Control Center v1.0.0 is the first stable release enabling full management of AI Agents and Workflows through a unified dashboard.

## Key Capabilities
- **Orchestration**: Define complex AI workflows and assign specific agents to steps.
- **Real-time**: Monitor task execution step-by-step via SSE.
- **Security**: Sandboxed tool execution to prevent system-level attacks.
- **Observability**: Deep tracing of LLM usage and system events.

## Setup
1. Clone repo.
2. Configure .env.
3. docker compose up -d.
4. docker compose exec api pnpm db:migrate.

## Rollback
- Revert to last known stable commit and restore DB backup using docs/runbooks/recovery.md.
