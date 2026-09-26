# Threat Model - AI Agent Control Center

## 1. Input Threats
- **Prompt Injection**: Users or agents may inject instructions into prompts to bypass tool restrictions.
- **Mitigation**: Validation of tool arguments via Zod and strict sandboxing of execution.

## 2. Execution Threats
- **Path Traversal**: Tool calls may attempt to read/write files outside the workspace.
- **Mitigation**: Path resolution and prefix validation in Sandbox.validatePath().
- **Command Injection**: LLM may generate malicious shell commands.
- **Mitigation**: Keyword-based banning and limited shell environment.

## 3. Access Threats
- **Session Hijacking**: Stealing session tokens.
- **Mitigation**: HttpOnly cookies and session rotation.
- **Privilege Escalation**: User attempting to access admin-only routes.
- **Mitigation**: Role-based access control (RBAC) in equireRole middleware.

