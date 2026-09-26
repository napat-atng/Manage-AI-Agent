
import { WorkflowDefinition, WorkflowNode } from "@aacc/contracts";
import { z } from "zod";

export class WorkflowCompiler {
  async validate(definition: WorkflowDefinition): Promise<{ valid: boolean; errors?: string[] }> {
    const errors: string[] = [];
    const nodes = definition.nodes;
    const nodeIds = new Set(nodes.map(n => n.id));

    // 1. Check for missing references (Dangling edges)
    for (const node of nodes) {
      if (node.next && !nodeIds.has(node.next)) {
        errors.push(`Node ${node.id} points to non-existent next node ${node.next}`);
      }
    }

    // 2. Cycle Detection (Simple DFS)
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const node = nodes.find(n => n.id === nodeId);
      if (node?.next) {
        if (!visited.has(node.next) && hasCycle(node.next)) return true;
        if (recStack.has(node.next)) return true;
      }

      recStack.delete(nodeId);
      return false;
    };

    if (!hasCycle(definition.startNodeId)) {
      // Check all nodes for cycles
      for (const node of nodes) {
        if (!visited.has(node.id) && hasCycle(node.id)) {
          errors.push("Workflow contains a cycle (not a DAG)");
          break;
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async compile(definition: WorkflowDefinition): Promise<any> {
    const validation = await this.validate(definition);
    if (!validation.valid) {
      throw new Error(`Invalid Workflow: ${validation.errors?.join(", ")}`);
    }
    // In a real LangGraph implementation, this would return a CompiledGraph
    return { 
      graphId: definition.workflowId, 
      startNode: definition.startNodeId,
      nodes: definition.nodes 
    };
  }
}

