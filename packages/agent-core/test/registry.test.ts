import { describe, it, expect } from 'vitest';
import { InMemoryAgentVersionRegistry } from '../src/registry.js';
import { AgentVersionSnapshot } from '../src/types.js';

describe('InMemoryAgentVersionRegistry', () => {
  const mockSnapshot: AgentVersionSnapshot = {
    id: '40000000-0000-0000-0000-000000000001',
    agentId: '30000000-0000-0000-0000-000000000001',
    agentName: 'manager',
    agentRole: 'manager',
    version: 1,
    systemPrompt: 'You are the Manager agent.',
    modelProfileId: '20000000-0000-0000-0000-000000000001',
    config: {},
    allowedTools: [],
  };

  it('should load an existing version', async () => {
    const registry = new InMemoryAgentVersionRegistry();
    registry.register(mockSnapshot);

    const loaded = await registry.load(mockSnapshot.id);
    expect(loaded).toEqual(mockSnapshot);
  });

  it('should throw an error for a missing version', async () => {
    const registry = new InMemoryAgentVersionRegistry();

    await expect(registry.load('non-existent-id')).rejects.toThrow('AgentVersion not found: non-existent-id');
  });
});
