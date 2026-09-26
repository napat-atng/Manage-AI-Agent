# Local Development Setup

## Infrastructure
The project uses Docker Compose to manage the infrastructure stack.

### Services
- **PostgreSQL** (Port 5432): Main database.
- **Redis** (Port 6379): Caching and queue.
- **Ollama** (Port 11434): Local LLM runtime.
- **LiteLLM** (Port 4000): LLM Gateway.

## Setup Instructions
1. Copy `.env.example` to `.env`:
   `cp .env.example .env`
2. Start the services:
   `docker compose up -d`
3. Pull the required LLM model in Ollama:
   `docker exec -it agent-ollama ollama pull llama3`

## Verification
Run `docker compose ps` to check the health status of all services.
