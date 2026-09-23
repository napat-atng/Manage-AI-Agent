import { DataTypes, type QueryInterface } from 'sequelize';

export async function up({ context: queryInterface }: { context: QueryInterface }): Promise<void> {
  // 1. users
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'viewer',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // 2. sessions
  await queryInterface.createTable('sessions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    token_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('sessions', ['user_id']);
  await queryInterface.addIndex('sessions', ['token_hash']);

  // 3. model_profiles
  await queryInterface.createTable('model_profiles', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    api_base: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // 4. agents
  await queryInterface.createTable('agents', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // 5. agent_versions
  await queryInterface.createTable('agent_versions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    agent_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'agents',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    system_prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    model_profile_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'model_profiles',
        key: 'id',
      },
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('agent_versions', ['agent_id', 'version'], {
    unique: true,
  });

  // 6. tools
  await queryInterface.createTable('tools', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    schema: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    policy: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // 7. agent_tools
  await queryInterface.createTable('agent_tools', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    agent_version_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'agent_versions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    tool_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tools',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('agent_tools', ['agent_version_id', 'tool_id'], {
    unique: true,
  });

  // 8. workflows
  await queryInterface.createTable('workflows', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // 9. workflow_versions
  await queryInterface.createTable('workflow_versions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    workflow_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'workflows',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    definition: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('workflow_versions', ['workflow_id', 'version'], {
    unique: true,
  });

  // 10. tasks
  await queryInterface.createTable('tasks', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    workflow_version_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'workflow_versions',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pending',
    },
    input: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    output: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    error: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('tasks', ['status']);
  await queryInterface.addIndex('tasks', ['created_at']);

  // 11. task_steps
  await queryInterface.createTable('task_steps', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    step_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pending',
    },
    input: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    output: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    error: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('task_steps', ['task_id', 'step_index']);

  // 12. agent_runs
  await queryInterface.createTable('agent_runs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    step_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'task_steps',
        key: 'id',
      },
    },
    agent_version_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'agent_versions',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pending',
    },
    metrics: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('agent_runs', ['task_id']);

  // 13. tool_runs
  await queryInterface.createTable('tool_runs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    agent_run_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'agent_runs',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    tool_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tools',
        key: 'id',
      },
    },
    input: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    output: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pending',
    },
    error: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('tool_runs', ['agent_run_id']);

  // 14. messages
  await queryInterface.createTable('messages', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    agent_run_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'agent_runs',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('messages', ['task_id', 'created_at']);

  // 15. events (monotonic per-task sequence unique constraint)
  await queryInterface.createTable('events', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    event_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
  await queryInterface.addIndex('events', ['task_id', 'sequence'], {
    unique: true,
  });

  // 16. outbox_jobs
  await queryInterface.createTable('outbox_jobs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'events',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    aggregate_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    aggregate_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pending',
    },
    retry_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    last_error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.addIndex('outbox_jobs', ['status', 'created_at']);
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  await queryInterface.dropTable('outbox_jobs');
  await queryInterface.dropTable('events');
  await queryInterface.dropTable('messages');
  await queryInterface.dropTable('tool_runs');
  await queryInterface.dropTable('agent_runs');
  await queryInterface.dropTable('task_steps');
  await queryInterface.dropTable('tasks');
  await queryInterface.dropTable('workflow_versions');
  await queryInterface.dropTable('workflows');
  await queryInterface.dropTable('agent_tools');
  await queryInterface.dropTable('tools');
  await queryInterface.dropTable('agent_versions');
  await queryInterface.dropTable('agents');
  await queryInterface.dropTable('model_profiles');
  await queryInterface.dropTable('sessions');
  await queryInterface.dropTable('users');
}
