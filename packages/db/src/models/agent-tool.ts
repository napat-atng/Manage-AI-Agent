import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface AgentToolAttributes {
  id: string;
  agentVersionId: string;
  toolId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AgentToolCreationAttributes extends Omit<
  AgentToolAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class AgentTool
  extends Model<AgentToolAttributes, AgentToolCreationAttributes>
  implements AgentToolAttributes
{
  declare id: string;
  declare agentVersionId: string;
  declare toolId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initAgentToolModel(sequelize: Sequelize): typeof AgentTool {
  AgentTool.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      agentVersionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'agent_version_id',
        references: {
          model: 'agent_versions',
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
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      tableName: 'agent_tools',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['agent_version_id', 'tool_id'],
        },
      ],
    },
  );
  return AgentTool;
}
