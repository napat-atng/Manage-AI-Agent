import type { QueryInterface } from 'sequelize';
import { INITIAL_AGENT_VERSION_SNAPSHOTS } from '@manage-ai/agent-core';

export async function up({ context: queryInterface }: { context: QueryInterface }): Promise<void> {
  const now = new Date();

  // 1. Initial admin user
  const adminId = '10000000-0000-0000-0000-000000000001';
  await queryInterface.bulkInsert('users', [
    {
      id: adminId,
      email: 'admin@example.com',
      name: 'System Admin',
      role: 'admin',
      created_at: now,
      updated_at: now,
    },
  ]);

  // 2. Initial model profile
  const modelProfileId = '20000000-0000-0000-0000-000000000001';
  await queryInterface.bulkInsert('model_profiles', [
    {
      id: modelProfileId,
      name: 'local-qwen2.5-3b',
      provider: 'ollama',
      model: 'qwen2.5:3b',
      api_base: 'http://localhost:4000',
      config: JSON.stringify({ temperature: 0.2 }),
      is_default: true,
      created_at: now,
      updated_at: now,
    },
  ]);

  // 3. Initial 4 agents
  const managerId = '30000000-0000-0000-0000-000000000001';
  const researcherId = '30000000-0000-0000-0000-000000000002';
  const coderId = '30000000-0000-0000-0000-000000000003';
  const reviewerId = '30000000-0000-0000-0000-000000000004';

  await queryInterface.bulkInsert('agents', [
    {
      id: managerId,
      name: 'manager',
      role: 'manager',
      description: 'Orchestrates workflows and delegates subtasks',
      created_at: now,
      updated_at: now,
    },
    {
      id: researcherId,
      name: 'researcher',
      role: 'researcher',
      description: 'Gathers context and performs web/doc analysis',
      created_at: now,
      updated_at: now,
    },
    {
      id: coderId,
      name: 'coder',
      role: 'coder',
      description: 'Writes, reviews and updates code',
      created_at: now,
      updated_at: now,
    },
    {
      id: reviewerId,
      name: 'reviewer',
      role: 'reviewer',
      description: 'Reviews code and verifies test passes',
      created_at: now,
      updated_at: now,
    },
  ]);

  // 4. Initial agent versions
  await queryInterface.bulkInsert('agent_versions', INITIAL_AGENT_VERSION_SNAPSHOTS.map(s => ({
    id: s.id,
    agent_id: s.agentId,
    version: s.version,
    system_prompt: s.systemPrompt,
    model_profile_id: s.modelProfileId,
    config: JSON.stringify(s.config),
    created_at: now,
    updated_at: now,
  })));

  // 5. Initial tools
  await queryInterface.bulkInsert('tools', [
    {
      id: '50000000-0000-0000-0000-000000000001',
      name: 'file_read',
      description: 'Read file contents from the workspace filesystem',
      schema: JSON.stringify({
        type: 'object',
        properties: { path: { type: 'string' } },
        required: ['path'],
      }),
      policy: JSON.stringify({ sandbox: 'workspace_only' }),
      created_at: now,
      updated_at: now,
    },
    {
      id: '50000000-0000-0000-0000-000000000002',
      name: 'file_write',
      description: 'Write file contents to the workspace filesystem',
      schema: JSON.stringify({
        type: 'object',
        properties: { path: { type: 'string' }, content: { type: 'string' } },
        required: ['path', 'content'],
      }),
      policy: JSON.stringify({ sandbox: 'workspace_only' }),
      created_at: now,
      updated_at: now,
    },
    {
      id: '50000000-0000-0000-0000-0000000000003',
      name: 'command_exec',
      description: 'Execute approved shell commands within the project workspace',
      schema: JSON.stringify({
        type: 'object',
        properties: { command: { type: 'string' } },
        required: ['command'],
      }),
      policy: JSON.stringify({ sandbox: 'restricted' }),
      created_at: now,
      updated_at: now,
    },
    {
      id: '50000000-0000-0000-0000-000000000004',
      name: 'web_search',
      description: 'Search documentation or public web resources',
      schema: JSON.stringify({
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query'],
      }),
      policy: JSON.stringify({ sandbox: 'network_only' }),
      created_at: now,
      updated_at: now,
    },
  ]);
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  await queryInterface.bulkDelete('tools', {});
  await queryInterface.bulkDelete('agent_versions', {});
  await queryInterface.bulkDelete('agents', {});
  await queryInterface.bulkDelete('model_profiles', {});
  await queryInterface.bulkDelete('users', {});
}
