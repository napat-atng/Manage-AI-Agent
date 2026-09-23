# Phase 14 — Usage & Observability

## Goal
ให้ operator เห็น health, structured logs, model usage และ execution trace โดย Langfuse เป็น optional.

## Scope
Pino, correlation IDs, metrics/health, usage aggregation, redaction and optional Langfuse adapter.

## Prerequisites / dependencies
Phase 03, 05, 09 and 10 complete.

## Exact tasks
- [ ] add shared Pino config with request/task/run correlation fields and redact paths.
- [ ] emit metrics for queue depth, run duration, failures, LLM latency/tokens and tool duration.
- [ ] persist normalized model usage from gateway and expose owner-safe usage summaries.
- [ ] add Langfuse adapter behind feature flag with no-op local fallback.
- [ ] document log retention, sensitive-data policy and troubleshooting queries/runbook.

## Files/folders ที่ต้องสร้างหรือแก้
`packages/observability/src/**`, `docs/observability.md`, `.env.example`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/observability test`; `pnpm -r typecheck`

## Implementation guidance
Events link task/run/step/correlation IDs. Cost may be unknown for local models—represent as null, never fabricated. Langfuse credentials optional and outbound connectivity opt-in.

## Acceptance criteria
one task can be traced across API/worker/gateway logs, usage totals match stored run records, and local run works with Langfuse disabled.

## Verification commands/tests
test redaction and no-op adapter; run sample task then query logs/usage; test metric exporter if included.

## Common pitfalls
อย่า send secrets/prompts by default, อย่า make observability failure block task, อย่า treat token count as money.

## Definition of done
Operator can diagnose a failed task from IDs without exposing sensitive data.

## Handoff prompt template
```text
Implement Phase 14 from 14-usage-observability.md. Add correlated Pino logs, safe metrics and normalized usage, with Langfuse strictly optional and no-op by default. Prove redaction and disabled-mode behavior in tests.
```
