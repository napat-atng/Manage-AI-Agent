# Recovery Runbook

## 1. Database Recovery
- **Backup**: docker exec postgres pg_dumpall -U postgres > backup.sql`n- **Restore**: docker exec -i postgres psql -U postgres < backup.sql`n
## 2. Queue Troubleshooting
- Check Redis keys for pending jobs: edis-cli KEYS " *job*\`n- Clear stuck queue: edis-cli FLUSHALL (Caution: destructive)

## 3. Model Unavailable
- Check Ollama status: docker exec agent-ollama ollama list`n- Restart Gateway: docker compose restart litellm
