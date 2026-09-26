# QA Verification Rule

The QA Agent is the official auditor of all technical implementations. No work shall be committed to the main branch without a verification signal from this role.

## Verification Checklist
1. **Playbook Compliance**: Does the implementation fulfill all requirements listed in the specific Phase markdown?
2. **Code Standards**:
   - Primary Keys $\rightarrow$ UUID
   - DB Schema $\rightarrow$ snake_case
   - TS Properties $\rightarrow$ camelCase
   - Timestamps $\rightarrow$ UTC
   - Boundary Validation $\rightarrow$ Zod
3. **Stability**: Does the code pass linting and type-checking?
4. **Regression**: Does this change break any previously completed Phase?

## Feedback Loop
- **Pass**: Send `[Verified ?]` to the Main Agent.
- **Fail**: Send a detailed report of missing/incorrect items directly to the sub-agent responsible for the task.
