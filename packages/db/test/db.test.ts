import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSequelize,
  createMigrator,
  createSeeder,
  initModels,
  withOutboxTransaction,
  User,
  ModelProfile,
  Agent,
  Tool,
  Task,
  Event,
  OutboxJob,
} from '../src/index.js';
import { UniqueConstraintError } from 'sequelize';

describe('Database Schema, Migrations, and Operations', () => {
  const sequelize = createSequelize();
  const migrator = createMigrator(sequelize);

  before(async () => {
    // Authenticate and ensure schema is clean
    await sequelize.authenticate();
    initModels(sequelize);
  });

  after(async () => {
    await sequelize.close();
  });

  it('1. should migrate from scratch cleanly', async () => {
    // Revert everything if anything exists
    try {
      await migrator.down({ to: 0 });
    } catch {
      // Ignore if clean
    }
    try {
      await sequelize.getQueryInterface().dropTable('SequelizeData');
    } catch {
      // Ignore
    }
    try {
      await sequelize.getQueryInterface().dropTable('SequelizeMeta');
    } catch {
      // Ignore
    }

    const migrations = await migrator.up();
    assert.ok(migrations.length > 0, 'At least one migration should run');
  });

  it('2. should rollback latest migration and re-migrate cleanly', async () => {
    const rolledBack = await migrator.down();
    assert.ok(rolledBack.length > 0, 'Migration should be rolled back');

    const reMigrated = await migrator.up();
    assert.ok(reMigrated.length > 0, 'Migration should re-run cleanly');
  });

  it('3. should seed initial data (users, model profile, 4 agents, tools)', async () => {
    try {
      await sequelize.getQueryInterface().dropTable('SequelizeData');
    } catch {
      // Ignore
    }
    const freshSeeder = createSeeder(sequelize);
    await freshSeeder.up();

    const admin = await User.findOne({ where: { email: 'admin@example.com' } });
    assert.ok(admin, 'Admin user should be seeded');
    assert.equal(admin.role, 'admin');

    const defaultProfile = await ModelProfile.findOne({
      where: { isDefault: true },
    });
    assert.ok(defaultProfile, 'Default model profile should be seeded');
    assert.equal(defaultProfile.model, 'qwen2.5:3b');

    const agents = await Agent.findAll();
    assert.equal(agents.length, 4, 'Should seed exactly 4 agents');
    const agentNames = agents.map((a) => a.name).sort();
    assert.deepEqual(agentNames, ['coder', 'manager', 'researcher', 'reviewer']);

    const tools = await Tool.findAll();
    assert.ok(tools.length >= 4, 'Should seed at least 4 core tools');
  });

  it('4. should atomically execute state mutation and insert outbox job', async () => {
    const task = await withOutboxTransaction(sequelize, async (transaction) => {
      const createdTask = await Task.create(
        {
          status: 'pending',
          input: { prompt: 'Test task with atomic outbox' },
        },
        { transaction },
      );

      return {
        result: createdTask,
        outbox: {
          aggregateType: 'task',
          aggregateId: createdTask.id,
          payload: { event: 'task_created', taskId: createdTask.id },
          status: 'pending',
        },
      };
    });

    assert.ok(task.id, 'Task should be created');
    const outboxJob = await OutboxJob.findOne({
      where: { aggregateId: task.id },
    });
    assert.ok(outboxJob, 'Outbox job should be atomically created with task');
    assert.equal(outboxJob.status, 'pending');
  });

  it('5. should reject duplicate event sequence for the same task', async () => {
    const task = await Task.create({
      status: 'running',
      input: { test: true },
    });

    // First event with sequence 1
    await Event.create({
      taskId: task.id,
      sequence: 1,
      eventType: 'task_started',
      payload: { step: 1 },
    });

    // Duplicate event with sequence 1 for the same task must be rejected
    await assert.rejects(
      async () => {
        await Event.create({
          taskId: task.id,
          sequence: 1,
          eventType: 'duplicate_event',
          payload: { step: 1 },
        });
      },
      (err) => {
        assert.ok(
          err instanceof UniqueConstraintError ||
            (err instanceof Error && /unique|constraint|duplicate/i.test(err.message)),
          'Should throw unique constraint error for duplicate event sequence',
        );
        return true;
      },
    );

    // Event with sequence 2 should succeed
    const event2 = await Event.create({
      taskId: task.id,
      sequence: 2,
      eventType: 'task_step_completed',
      payload: { step: 1 },
    });
    assert.equal(event2.sequence, 2);
  });
});
