
import { AgentDefinition, ModelGateway } from "@aacc/contracts";
import { AgentRegistry } from "../registry/agent-registry";
import { UUIDSchema } from "@aacc/contracts";

export class AgentExecutor {
  constructor(
    private registry: AgentRegistry,
    private gateway: ModelGateway
  ) {}

  async execute(versionId: string, input: string, context: any): Promise<string> {
    const definition = await this.registry.getVersion(versionId);
    if (!definition) throw new Error(`Agent version ${versionId} not found`);

    // 1. Compose Prompt
    const systemPrompt = this.composeSystemPrompt(definition, context);
    
    // 2. Call LLM Gateway
    const response = await this.gateway.generateResponse(`${systemPrompt}\n\nUser: ${input}`, definition.config);
    
    // 3. Log the run (Simplified for this phase, would hit DB in reality)
    console.log(`Agent ${definition.name} run completed. Tokens: ${response.usage.totalTokens}`);
    
    return response.text;
  }

  private composeSystemPrompt(definition: AgentDefinition, context: any): string {
    let prompt = `You are ${definition.name}. ${definition.config.systemPrompt || ""}\n`;
    if (definition.tools.length > 0) {
      prompt += `\nAvailable Tools:\n` + definition.tools.map(t => `- ${t.name}: ${t.description}`).join("\n");
    }
    return prompt;
  }
}

