import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgentExecutor } from '../src/executor.js';
import type { LiteLLMGateway, AgentRunRepository } from '../src/types.js';
import { AgentVersionSnapshot, ExecutionContext, AgentInput } from '../src/types.js';

describe('AgentExecutor', () => {
  let mockGateway: any;
  let mockRepository: any;
  let executor: AgentExecutor;
  let eventHandler: (event: any) => void;

  const mockSnapshot: AgentVersionSnapshot = {
    id: '40000000-0000-0000-0000-000000000001',
    agentId: '30000000-0000-0000-0000-000000000001',
    agentName: 'manager',
    agentRole: 'manager',
    version: 1,
    systemPrompt: 'You are the Manager agent.',
    modelProfileId: '20000000-0000-0000-0000-000000000001',
    config: { temperature: 0.7 },
    allowedTools: [
      {
        id: '50000000-0000-0000-0000-000000000001',
        name: 'search_docs',
        description: 'Search through documents',
        inputSchema: {},
      },
    ],
  };

  const mockCtx: ExecutionContext = {
    taskId: '00000000-0000-4000-a000-000000000001',
    stepId: '00000000-0000-4000-a000-000000000002',
    correlationId: 'corr-123',
    taskContext: 'Goal: Implement Phase 6',
  };

  const mockInput: AgentInput = {
    userMessage: 'Hello, start the process.',
  };

  beforeEach(() => {
    mockGateway = {
      complete: vi.fn().mockResolvedValue({
        content: 'Acknowledged. Starting process.',
        model: 'gpt-4',
        provider: 'openai',
        usage: {
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150,
        },
      }),
    };

    mockRepository = {
      create: vi.fn().mockResolvedValue(undefined),
      updateStatus: vi.fn().mockResolvedValue(undefined),
    };

    eventHandler = vi.fn();

    executor = new AgentExecutor({
      gateway: mockGateway,
      repository: mockRepository,
      onEvent: eventHandler,
    });
  });

  it('should successfully run: verify system prompt composition and output format', async () => {
    const result = await executor.run(mockSnapshot, mockCtx, mockInput);

    // Verify output format
    expect(result).toEqual({
      content: 'Acknowledged. Starting process.',
      model: 'gpt-4',
      provider: 'openai',
      latencyMs: expect.any(Number),
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
      agentRunId: expect.any(String),
    });

    // Verify system prompt composition
    const gatewayCall = mockGateway.complete.mock.calls[0][0];
    const systemMessage = gatewayCall.messages.find((m: any) => m.role === 'system');

    expect(systemMessage.content).toContain(mockSnapshot.systemPrompt);
    expect(systemMessage.content).toContain('## Task Context');
    expect(systemMessage.content).toContain(mockCtx.taskContext);
    expect(systemMessage.content).toContain('## Available Tools');
    expect(systemMessage.content).toContain('search_docs');

    // Verify temperature passed from config
    expect(gatewayCall.temperature).toBe(0.7);
  });

  it('should persist lifecycle: verify create and updateStatus calls', async () => {
    const result = await executor.run(mockSnapshot, mockCtx, mockInput);
    const runId = result.agentRunId;

    // Verify repository.create
    expect(mockRepository.create).toHaveBeenCalledWith({
      id: runId,
      taskId: mockCtx.taskId,
      stepId: mockCtx.stepId,
      agentVersionId: mockSnapshot.id,
      status: 'running',
    });

    // Verify repository.updateStatus
    expect(mockRepository.updateStatus).toHaveBeenCalledWith(
      runId,
      'completed',
      expect.objectContaining({
        latencyMs: expect.any(Number),
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
        model: 'gpt-4',
        provider: 'openai',
      })
    );
  });

  it('should emit domain events: started and completed', async () => {
    const result = await executor.run(mockSnapshot, mockCtx, mockInput);
    const runId = result.agentRunId;

    expect(eventHandler).toHaveBeenCalledWith({
      type: 'run.started',
      agentRunId: runId,
      taskId: mockCtx.taskId,
      agentVersionId: mockSnapshot.id,
    });

    expect(eventHandler).toHaveBeenCalledWith({
      type: 'run.completed',
      agentRunId: runId,
      latencyMs: expect.any(Number),
    });
  });

  it('should handle errors: verify run.failed emission and repository status update', async () => {
    const error = new Error('Gateway timeout');
    mockGateway.complete.mockRejectedValue(error);

    await expect(executor.run(mockSnapshot, mockCtx, mockInput)).rejects.toThrow('Gateway timeout');

    // Capture the generated runId from the repository.create call
    const runId = mockRepository.create.mock.calls[0][0].id;

    expect(mockRepository.updateStatus).toHaveBeenCalledWith(
      runId,
      'failed',
      { error: 'Gateway timeout' }
    );

    expect(eventHandler).toHaveBeenCalledWith({
      type: 'run.failed',
      agentRunId: runId,
      error: 'Gateway timeout',
    });
  });
});
