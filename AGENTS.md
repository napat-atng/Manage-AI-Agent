# Agent Rules & Systematic Workflow

## Mandatory Step-by-Step Workflow Rules

1. **Checklist Tracking**:
   - As soon as each Phase or major step is completed and verified, immediately update `ai-agent-control-center-v1-playbook/CHECKLIST.md` to mark it as completed (`[x]`).

2. **Git Commit After Each Phase**:
   - Every completed phase must be committed to Git with a descriptive conventional commit message (e.g., `feat(infra): implement phase 02 docker-compose infrastructure stack`, `feat(db): implement phase 03 database schema and migrations`).
   - Do not bundle multiple unverified phases into a single commit.

3. **Verification Before Checkoff**:
   - Before ticking the checklist and committing, run verification commands (e.g. `typecheck`, `lint`, unit tests, integration checks).

4. **Blocker & Issue Reporting**:
   - If an issue or ambiguity occurs, record it in `PROBLEM.md` or ask the user before proceeding.
   - When a blocker is resolved, update `PROBLEM.md` to reflect the resolution.

5. **Code Quality & Consistency**:
   - Follow strict TypeScript, Zod at boundaries, UUID primary keys, snake_case database schema, camelCase TypeScript properties, and UTC timestamps.
