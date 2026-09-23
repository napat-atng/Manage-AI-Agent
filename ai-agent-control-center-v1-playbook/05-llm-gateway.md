# Phase 05 — LLM Gateway

## Goal
เชื่อม provider-neutral `ModelGateway` กับ LiteLLM โดย Ollama เป็น default.

## Scope
Model profiles, gateway client, streaming, timeouts, usage normalization และ safe errors.

## Prerequisites / dependencies
Phase 02–04 complete.

## Exact tasks
- [ ] สร้าง `packages/llm` ที่ implement `ModelGateway` ด้วย LiteLLM OpenAI-compatible API.
- [ ] load `model_profiles` จาก DB และ validate config before use.
- [ ] รองรับ `complete` และ `stream`; normalize tokens/model/latency/cost nullable.
- [ ] ตั้ง timeout, retry policy เฉพาะ idempotent calls และ correlation ID headers.
- [ ] seed local profile เช่น `ollama/<chosen-model>` และเขียน provider adapter tests ด้วย mock server.

## Files/folders ที่ต้องสร้างหรือแก้
`packages/llm/src/**`, `packages/db/src/seeders/**`, `docs/models.md`

## Commands ที่ต้องรัน
`pnpm --filter @aacc/llm test`; `curl http://localhost:<litellm-port>/v1/models`

## Implementation guidance
API key ต้องอยู่ environment/secret store เท่านั้น. Cloud profile เป็น optional and disabled by default. Preserve provider response metadata only after redact; never log prompt content by default.

## Acceptance criteria
gateway completion ผ่าน LiteLLM/Ollama ได้, stream emits ordered chunks, failure maps to typed retryable/non-retryable error.

## Verification commands/tests
`pnpm --filter @aacc/llm test`; local smoke request against LiteLLM; typecheck.

## Common pitfalls
อย่าให้ worker call Ollama directly, อย่า assume token usage exists, อย่า retry unsafe tool-adjacent work.

## Definition of done
ทุก agent runtime เรียก model ผ่าน `ModelGateway` contract เดียว.

## Handoff prompt template
```text
Implement Phase 05 from 05-llm-gateway.md. Use LiteLLM as the only gateway boundary and Ollama as default. Add normalized streaming/usage/errors and mock-based tests plus a local smoke check.
```
