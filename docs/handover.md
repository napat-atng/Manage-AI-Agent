# Project Handover Document - AACC v1

## Project Status
- **Version**: 1.0.0
- **Status**: Release Candidate Passed
- **Coverage**: Unit, Integration, E2E tests implemented.

## Architecture Summary
- **Frontend**: Next.js (Apps/Web)
- **Backend**: Express API (Apps/API)
- **Database**: PostgreSQL (Packages/DB)
- **Messaging**: Redis (Infrastructure)
- **LLM Gateway**: LiteLLM + Ollama

## Critical Paths
- API -> Worker -> DB -> Event Stream (SSE)
- User -> Dashboard -> API -> Sandbox -> Tool

## Maintenance
- See docs/runbooks/ for operational recovery.
- See docs/deployment.md for host setup.

## Future Roadmap
- Cloud-native scaling.
- Multi-tenancy support.
- Advanced Prompt-Injection defenses.
