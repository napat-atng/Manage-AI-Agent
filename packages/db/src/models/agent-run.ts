import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface AgentRunAttributes {
  id: string;
  taskId: string;
  stepId?: string | null;
  agentVersionId: string;
  status: string;
  metrics?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AgentRunCreationAttributes extends Omit<
  AgentRunAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class AgentRun
  extends Model<AgentRunAttributes, AgentRunCreationAttributes>
  implements AgentRunAttributes
{
  declare id: string;
  declare taskId: string;
  declare stepId: string | null;
  declare agentVersionId: string;
  declare status: string;
  declare metrics: Record<string, unknown> | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initAgentRunModel(sequelize: Sequelize): typeof AgentRun {
  AgentRun.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'task_id',
        references: {
          model: 'tasks',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      stepId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'step_id',
        references: {
          model: 'task_steps',
          key: 'id',
        },
      },
      agentVersionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'agent_version_id',
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
    },
    {
      sequelize,
      tableName: 'agent_runs',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['task_id'],
        },
      ],
    },
  );
  return AgentRun;
}
