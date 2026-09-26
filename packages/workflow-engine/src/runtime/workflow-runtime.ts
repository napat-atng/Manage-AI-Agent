
import { WorkflowDefinition, WorkflowNode } from "@aacc/contracts";
import { AgentExecutor } from "@aacc/agent-core";
import { ToolRegistry } from "@aacc/tools";
import { UUIDSchema } from "@aacc/contracts";

export class WorkflowRuntime {
  constructor(
    private agentExecutor: AgentExecutor,
    private toolRegistry: ToolRegistry
  ) {}

  async executeStep(taskId: string, definition: WorkflowDefinition, currentNodeId: string, state: any): Promise<{ nextNodeId: string | null; newState: any }> {
    const node = definition.nodes.find(n => n.id === currentNodeId);
    if (!node) throw new Error(`Node ${currentNodeId} not found in workflow`);

    console.log(`Executing Workflow Node: ${node.id} (Type: ${node.node.type})`);

    let result: any;
    switch (node.node.type) {
      case "agent":
        result = await this.agentExecutor.execute(node.node.agentId, state.input, state);
        break;
      case "tool":
        result = await this.toolRegistry.executeTool(node.node.toolId, state.input);
        break;
      case "condition":
        // Simplified condition: check if "status" matches
        const branch = (state.status === "success") ? "success_path" : "failure_path";
        return { nextNodeId: node.node.branches[branch], newState: state };
      case "approval":
        // Durable Pause: Throw a specific error to signal the worker to stop and wait for external trigger
        throw new Error("SUSPEND_FOR_APPROVAL");
      case "transform":
        result = this.applyTransform(node.node.script, state);
        break;
    }

    return {
      nextNodeId: node.next,
      newState: { ...state, lastResult: result },
    };
  }

  private applyTransform(script: string, state: any): any {
    // In V1, this is a simple mapping. Real implementation would use a safe sandbox.
    return { ...state, transformed: true, scriptUsed: script };
  }
}

