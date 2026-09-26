import { AgentVersion } from './models/agent-version.js';
import type { AgentVersionSnapshot } from '@manage-ai/agent-core';

export class AgentVersionRepository {
  async findById(id: string): Promise<AgentVersion | null> {
    return AgentVersion.findByPk(id);
  }

  async findByAgentAndVersion(agentId: string, version: number): Promise<AgentVersion | null> {
    return AgentVersion.findOne({
      where: {
        agentId,
        version,
      },
    });
  }
}

export const agentVersionRepository = new AgentVersionRepository();
