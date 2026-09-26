# Systematic Phase Execution Rule (Updated)

Always follow this sequence for every phase in the playbook:

1. **Implementation**: Implement the phase according to its playbook specification (`00` - `20`).
2. **Local Verification**: Run verification commands (lint, typecheck, tests) to ensure the work is stable.
3. **Notification**: Provide a brief summary of completed work to the Main Agent in the requested format: `[Phase X] ? Completed: (Action 1, 2, 3) | Modified Files: (list)`.
4. **QA Audit**: Wait for the QA Agent to verify the work. If feedback is received, implement fixes immediately.
5. **Handover**: Once the QA Agent signals `[Verified ?]`, the Main Agent will perform the final review, update the Checklist, and commit the changes to Git.



**Communication Hub**: All inter-agent communication must pass through the Main Agent. Format: @MainAgent: [Type] -> [Target]: [Message]. The Main Agent will broadcast these messages to ensure full visibility.

If blockers or questions arise, update PROBLEM.md or consult the user immediately.

