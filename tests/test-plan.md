# Testing Strategy - AACC

## 1. Test Layers
- **Unit Tests**: Logic validation (Zod schemas, AuthManager, Sandbox).
- **Integration Tests**: Component interactions (API -> DB, Worker -> Queue).
- **Contract Tests**: API response validation against schemas.
- **Component Tests**: UI component behavior (TaskForm, SSE hook).

## 2. Environment
- Isolated Postgres/Redis for tests.
- Mocked LLM at Gateway boundary.

## 3. Command Suite
- pnpm test: Run all unit tests.
- pnpm test:integration: Run integration suite.
- pnpm test:coverage: Generate coverage report.
