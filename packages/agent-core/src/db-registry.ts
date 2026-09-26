import { AgentVersionRegistry } from './registry.js';
import { agentVersionRepository } from '@aacc/db';
import type { AgentVersionSnapshot } from './types.js';
import { Agent } from '@aacc/db';

export class DbAgentVersionRegistry implements AgentVersionRegistry {
  async load(agentVersionId: string): Promise<AgentVersionSnapshot> {
    const version = await agentVersionRepository.findById(agentVersionId);

    if (!version) {
      throw new Error(`AgentVersion not found: ${agentVersionId}`);
    }

    // Fetch associated agent to get name and role
    const agent = await Agent.findByPk(version.agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${version.agentId}`);
    }

    return {
      id: version.id,
      agentId: version.agentId,
      agentName: agent.name,
      agentRole: agent.role,
      version: version.version,
      systemPrompt: version.systemPrompt,
      modelProfileId: version.modelProfileId,
      config: version.config as Record<string, any>,
      allowedTools: [], // Tool bindings handled by registry/repository separately if needed,
                        // but snapshot requires allowedTools. For now empty as per initial snapshots.
    };
  }
}
