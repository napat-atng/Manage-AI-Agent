// src/registry.ts - Agent version registry (in-memory + interface for DB-backed)
import type { AgentVersionSnapshot } from './types.js';

export interface AgentVersionRegistry {
  /**
   * Load a version snapshot by agentVersionId (pinned at task creation time).
   */
  load(agentVersionId: string): Promise<AgentVersionSnapshot>;
}

/**
 * In-memory registry — used in tests and seeded locally.
 */
export class InMemoryAgentVersionRegistry implements AgentVersionRegistry {
  private readonly versions = new Map<string, AgentVersionSnapshot>();

  register(snapshot: AgentVersionSnapshot): void {
    this.versions.set(snapshot.id, snapshot);
  }

  async load(agentVersionId: string): Promise<AgentVersionSnapshot> {
    const snapshot = this.versions.get(agentVersionId);
    if (!snapshot) {
      throw new Error(`AgentVersion not found: ${agentVersionId}`);
    }
    return snapshot;
  }
}

/**
 * Predefined snapshots for the four initial agents.
 * IDs mirror the seed in packages/db/src/seeders/001_initial_seed.ts.
 */
export const INITIAL_AGENT_VERSION_SNAPSHOTS: AgentVersionSnapshot[] = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    agentId: '30000000-0000-0000-0000-000000000001',
    agentName: 'manager',
    agentRole: 'manager',
    version: 1,
    systemPrompt:
      'You are the Manager agent. You break down complex goals into steps and orchestrate workers.',
    modelProfileId: '20000000-0000-0000-0000-000000000001',
    config: { max_turns: 20 },
    allowedTools: [],
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    agentId: '30000000-0000-0000-0000-000000000002',
    agentName: 'researcher',
    agentRole: 'researcher',
    version: 1,
    systemPrompt:
      'You are the Researcher agent. You analyze documents, query information, and synthesize research findings.',
    modelProfileId: '20000000-0000-0000-0000-000000000001',
    config: { max_turns: 10 },
    allowedTools: [],
  },
  {
    id: '40000000-0000-0000-0000-000000000003',
    agentId: '30000000-0000-0000-0000-000000000003',
    agentName: 'coder',
    agentRole: 'coder',
    version: 1,
    systemPrompt:
      'You are the Coder agent. You implement features, fix bugs, and adhere to architecture rules.',
    modelProfileId: '20000000-0000-0000-0000-000000000001',
    config: { max_turns: 30 },
    allowedTools: [],
  },
  {
    id: '40000000-0000-0000-0000-000000000004',
    agentId: '30000000-0000-0000-0000-000000000004',
    agentName: 'reviewer',
    agentRole: 'reviewer',
    version: 1,
    systemPrompt:
      'You are the Reviewer agent. You audit code quality, verify test outcomes, and validate acceptance criteria.',
    modelProfileId: '20000000-0000-0000-0000-000000000001',
    config: { max_turns: 10 },
    allowedTools: [],
  },
];

/**
 * Build a pre-populated InMemoryAgentVersionRegistry from the initial snapshots.
 */
export function buildDefaultRegistry(): InMemoryAgentVersionRegistry {
  const registry = new InMemoryAgentVersionRegistry();
  for (const snapshot of INITIAL_AGENT_VERSION_SNAPSHOTS) {
    registry.register(snapshot);
  }
  return registry;
}
