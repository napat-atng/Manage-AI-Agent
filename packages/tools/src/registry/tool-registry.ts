
import { AgentTool } from "@aacc/contracts";

export class ToolRegistry {
  private tools: Map<string, (args: any) => Promise<any>> = new Map();

  registerTool(tool: AgentTool, handler: (args: any) => Promise<any>) {
    this.tools.set(tool.name, handler);
  }

  async executeTool(toolName: string, args: any): Promise<any> {
    const handler = this.tools.get(toolName);
    if (!handler) throw new Error(`Tool ${toolName} not found in registry`);
    return await handler(args);
  }
}

