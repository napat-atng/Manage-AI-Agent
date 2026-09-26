# Agents

This document describes the specialized agents within the AI Agent Control Center (AACC) system, their roles, and how they are managed.

## Agent Roles

The system utilizes a multi-agent orchestration pattern where a central manager coordinates specialized worker agents.

### Manager
- **Purpose**: Acts as the orchestrator and strategic lead for any given task.
- **System Prompt**: `You are the Manager agent. You break down complex goals into steps and orchestrate workers.`
- **Primary Responsibilities**:
  - Decomposition of high-level goals into actionable subtasks.
  - Delegation of tasks to the appropriate worker agent.
  - Synthesis of results from workers into a final deliverable.
  - Managing the overall workflow state.

### Researcher
- **Purpose**: Performs deep-dive analysis and information gathering.
- **System Prompt**: `You are the Researcher agent. You analyze documents, query information, and synthesize research findings.`
- **Primary Responsibilities**:
  - Analyzing existing codebase and documentation.
  - Performing web searches for external information.
  - Synthesizing research findings into a format usable by the Coder or Manager.

### Coder
- **Purpose**: Handles the technical implementation and modification of the codebase.
- **System Prompt**: `You are the Coder agent. You implement features, fix bugs, and adhere to architecture rules.`
- **Primary Responsibilities**:
  - Writing and editing source code.
  - Implementing features based on research and management instructions.
  - Ensuring adherence to project architecture and coding standards.

### Reviewer
- **Purpose**: Provides quality assurance and validation.
- **System Prompt**: `You are the Reviewer agent. You audit code quality, verify test outcomes, and validate acceptance criteria.`
- **Primary Responsibilities**:
  - Auditing code changes for bugs and maintainability.
  - Verifying that tests pass and coverage is sufficient.
  - Validating that the final output meets the defined acceptance criteria.

## Agent Interaction Flow

1. **Goal Initiation**: The system receives a high-level goal.
2. **Orchestration**: The **Manager** decomposes the goal and creates a plan.
3. **Execution**:
   - The **Researcher** gathers context and defines requirements.
   - The **Coder** implements the technical solution.
4. **Validation**: The **Reviewer** audits the implementation and verifies the outcome.
5. **Completion**: The **Manager** synthesizes the final result and marks the task as complete.

## Version Pinning Mechanism

To ensure stability and reproducibility, the AACC system employs a strict version pinning mechanism for agents.

### How it Works

Instead of referencing an agent by a generic ID (which might change prompts or models over time), the system uses **Agent Version Snapshots**.

1. **Snapshotting**: Every iteration of an agent's configuration (System Prompt, Model Profile, and Config) is stored as a unique `AgentVersion` record in the database.
2. **Pinning at Creation**: When a task or subtask is created, the system resolves the current "active" version of the required agent and pins its specific `agentVersionId` to that task.
3. **Immutable Execution**: Throughout the lifetime of that task, the system only loads the pinned version snapshot. Even if the global agent prompt is updated for *future* tasks, the current task continues to use the version it was pinned to.
4. **Registry Resolution**: The `AgentVersionRegistry` is responsible for loading these snapshots. It ensures that the executor always has the exact prompt and model profile intended at the moment of task assignment.

This mechanism prevents "prompt drift" where an update to an agent's instructions might unexpectedly break an ongoing multi-step workflow.
