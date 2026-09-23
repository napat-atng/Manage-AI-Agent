# Database Schema & Conventions

## Overview

The database layer for AI Agent Control Center V1 is implemented with PostgreSQL and Sequelize, managed strictly via Umzug migrations.

## Entity Schema

### Metadata & Configuration Tables

- `users`: Core user accounts with role-based access (`admin`, `operator`, `viewer`).
- `sessions`: User sessions referencing `users(id)` with token hashes and expirations.
- `model_profiles`: Configured LLM profiles (`ollama`, `litellm`, etc.) with `is_default` flag.
- `agents`: Agent definitions (`manager`, `researcher`, `coder`, `reviewer`).
- `agent_versions`: Immutable versioned prompts and model profile references with unique `(agent_id, version)`.
- `tools`: Available execution tools with JSONB input schemas and policy rules.
- `agent_tools`: Mapping between agent versions and permitted tools with unique `(agent_version_id, tool_id)`.
- `workflows`: Multi-agent workflow definitions.
- `workflow_versions`: Immutable versioned workflow graphs with unique `(workflow_id, version)`.

### Execution & Event Tables

- `tasks`: Top-level task execution state (`pending`, `running`, `completed`, `failed`, `cancelled`).
- `task_steps`: Discrete execution steps within a task.
- `agent_runs`: Agent invocations assigned to task steps.
- `tool_runs`: Tool invocations executed by agents.
- `messages`: Chronological conversation turns and tool calls.
- `events`: Append-only event store with strict monotonic unique `(task_id, sequence)` constraint.
- `outbox_jobs`: Transactional outbox records for reliable event publication.

## Key Design Patterns

### 1. Monotonic Event Sequence

Every event emitted within a task is assigned an incrementing integer `sequence`. The database enforces a `UNIQUE(task_id, sequence)` constraint, ensuring no event collisions or duplicate sequences can ever be persisted.

### 2. Transactional Outbox Pattern

State mutations and their corresponding event outbox entries are committed atomically using `withOutboxTransaction`:

```typescript
const result = await withOutboxTransaction(sequelize, async (transaction) => {
  const task = await Task.create({ ... }, { transaction });
  return {
    result: task,
    outbox: { aggregateType: 'task', aggregateId: task.id, payload: { ... } },
  };
});
```

### 3. Migration & Seeding Commands

- Run migrations: `pnpm --filter @aacc/db migrate`
- Rollback migration: `pnpm --filter @aacc/db migrate:undo`
- Seed initial data: `pnpm --filter @aacc/db seed`
- Run integration tests: `pnpm --filter @aacc/db test`
