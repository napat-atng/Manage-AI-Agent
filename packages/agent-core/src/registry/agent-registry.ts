
import { AgentDefinition, AgentTool } from "@aacc/contracts";
import { ModelProfileSchema } from "@aacc/db"; // Assuming shared schema access

export class AgentRegistry {
  private agents: Map<string, AgentDefinition> = new Map();
  private versions: Map<string, AgentDefinition> = new Map();

  async registerAgent(definition: AgentDefinition) {
    this.agents.set(definition.agentId, definition);
  }

  async registerVersion(versionId: string, definition: AgentDefinition) {
    this.versions.set(versionId, definition);
  }

  async getAgent(agentId: string): Promise<AgentDefinition | undefined> {
    return this.agents.get(agentId);
  }

  async getVersion(versionId: string): Promise<AgentDefinition | undefined> {
    return this.versions.get(versionId);
  }

  // Seed initial agents as requested in Phase 06
  async seedInitialAgents() {
    const initialAgents = [
      { id: "manager", role: "Manager", prompt: "You are the Manager. You delegate tasks and synthesize results." },
      { id: "researcher", role: "Researcher", prompt: "You are the Researcher. You collect evidence and facts." },
      { id: "coder", role: "Coder", prompt: "You are the Coder. You propose and edit code via tools." },
      { id: "reviewer", role: "Reviewer", prompt: "You are the Reviewer. You evaluate code and logic." },
    ];

    for (const a of initialAgents) {
      // In real implementation, these would be UUIDs and full AgentDefinitions from DB
      console.log(`Seeding agent: ${a.id} as ${a.role}`);
    }
  }
}

