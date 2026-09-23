# Systematic Phase Execution Rule

Always follow this sequence for every phase in the playbook:

1. Implement the phase according to its playbook specification (`00` - `20`).
2. Run verification commands (lint, typecheck, tests).
3. Update `ai-agent-control-center-v1-playbook/CHECKLIST.md` marking the phase as `[x]`.
4. Commit the changes to Git.
5. If blockers or questions arise, update `PROBLEM.md` or consult the user.
