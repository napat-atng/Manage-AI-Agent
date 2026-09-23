import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface TaskAttributes {
  id: string;
  workflowVersionId?: string | null;
  userId?: string | null;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  input: Record<string, unknown>;
  output?: Record<string, unknown> | null;
  error?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes extends Omit<
  TaskAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  declare id: string;
  declare workflowVersionId: string | null;
  declare userId: string | null;
  declare status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  declare input: Record<string, unknown>;
  declare output: Record<string, unknown> | null;
  declare error: Record<string, unknown> | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initTaskModel(sequelize: Sequelize): typeof Task {
  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      workflowVersionId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'workflow_version_id',
        references: {
          model: 'workflow_versions',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'user_id',
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
    },
    {
      sequelize,
      tableName: 'tasks',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['status'],
        },
        {
          fields: ['created_at'],
        },
      ],
    },
  );
  return Task;
}
