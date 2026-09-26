import { describe, it, expect, vi } from 'vitest';
import { DbAgentVersionRegistry } from '../src/db-registry.js';
import { AgentVersionRepository, Agent } from '@aacc/db';
import { AgentVersionSnapshot } from '../src/types.js';

vi.mock('@aacc/db', async () => {
  const actual = await vi.importActual('@aacc/db');
  return {
    ...actual,
    agentVersionRepository: {
      findById: vi.fn(),
    },
    Agent: {
      findByPk: vi.fn(),
    },
  };
});

import { agentVersionRepository } from '@aacc/db';

describe('DbAgentVersionRegistry', () => {
  const mockVersion = {
    id: '40000000-0000-0000-0000-000000000001',
    agentId: '30000000-0000-0000-0000-000000000001',
    version: 1,
    systemPrompt: 'You are the Manager agent.',
    modelProfileId: '20000000-0000-0000-0000-000000000001',
    config: { max_turns: 20 },
  };

  const mockAgent = {
    id: '30000000-0000-0000-0000-000000000001',
    name: 'manager',
    role: 'manager',
  };

  it('should load a version from the database', async () => {
    (agentVersionRepository.findById as any).mockResolvedValue(mockVersion);
    (Agent.findByPk as any).mockResolvedValue(mockAgent);

    const registry = new DbAgentVersionRegistry();
    const loaded = await registry.load(mockVersion.id);

    expect(loaded).toEqual({
      id: mockVersion.id,
      agentId: mockVersion.agentId,
      agentName: mockAgent.name,
      agentRole: mockAgent.role,
      version: mockVersion.version,
      systemPrompt: mockVersion.systemPrompt,
      modelProfileId: mockVersion.modelProfileId,
      config: mockVersion.config,
      allowedTools: [],
    });
  });

  it('should throw error if version not found', async () => {
    (agentVersionRepository.findById as any).mockResolvedValue(null);

    const registry = new DbAgentVersionRegistry();
    await expect(registry.load('missing-id')).rejects.toThrow('AgentVersion not found: missing-id');
  });

  it('should throw error if agent not found', async () => {
    (agentVersionRepository.findById as any).mockResolvedValue(mockVersion);
    (Agent.findByPk as any).mockResolvedValue(null);

    const registry = new DbAgentVersionRegistry();
    await expect(registry.load(mockVersion.id)).rejects.toThrow('Agent not found: ' + mockVersion.agentId);
  });
});
