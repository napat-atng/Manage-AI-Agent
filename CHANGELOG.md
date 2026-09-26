# Changelog - AI Agent Control Center

## [1.0.0] - 2026-09-26

### Added
- Full Infrastructure Stack (Postgres, Redis, Ollama, LiteLLM).
- Database Schema with UUIDs, Zod Validations, and Migrations.
- Core Engine for Workflow and Agent management.
- REST API v1 with Auth (RBAC) and Real-time SSE updates.
- Next.js Dashboard with Task Management and SSE Client.
- Observability system with correlated Pino logs and metrics.
- Security Sandbox for path/command validation.
- E2E Test Suite using Playwright.
- Production Hardening with Compose Production and Recovery Runbooks.

### Fixed
- Standardized naming conventions (snake_case SQL, camelCase TS).

### Known Limitations
- Single-host deployment target.
- No multi-tenancy support in V1.
- Local-first model execution only.
