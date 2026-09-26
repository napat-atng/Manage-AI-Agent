# Deployment Guide

## Prerequisites
- Docker and Docker Compose installed.
- .env file configured with production secrets.

## Deployment Steps
1. **Build Images**: docker compose build 
2. **Start Services**: docker compose -f docker-compose.yml -f docker-compose.production.yml up -d 
3. **Run Migrations**: docker compose exec api pnpm db:migrate 

## Post-Deployment Check
- Verify health endpoint: curl http://localhost:3001/health 
- Check logs: docker compose logs -f api 
