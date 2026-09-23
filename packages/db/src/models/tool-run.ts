import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ToolRunAttributes {
  id: string;
  agentRunId: string;
  toolId: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown> | null;
  status: string;
  error?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ToolRunCreationAttributes extends Omit<
  ToolRunAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class ToolRun
  extends Model<ToolRunAttributes, ToolRunCreationAttributes>
  implements ToolRunAttributes
{
  declare id: string;
  declare agentRunId: string;
  declare toolId: string;
  declare input: Record<string, unknown>;
  declare output: Record<string, unknown> | null;
  declare status: string;
  declare error: Record<string, unknown> | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initToolRunModel(sequelize: Sequelize): typeof ToolRun {
  ToolRun.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      agentRunId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'agent_run_id',
        references: {
          model: 'agent_runs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      toolId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'tool_id',
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
    },
    {
      sequelize,
      tableName: 'tool_runs',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['agent_run_id'],
        },
      ],
    },
  );
  return ToolRun;
}
