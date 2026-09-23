import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface AgentVersionAttributes {
  id: string;
  agentId: string;
  version: number;
  systemPrompt: string;
  modelProfileId: string;
  config: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AgentVersionCreationAttributes extends Omit<
  AgentVersionAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class AgentVersion
  extends Model<AgentVersionAttributes, AgentVersionCreationAttributes>
  implements AgentVersionAttributes
{
  declare id: string;
  declare agentId: string;
  declare version: number;
  declare systemPrompt: string;
  declare modelProfileId: string;
  declare config: Record<string, unknown>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initAgentVersionModel(sequelize: Sequelize): typeof AgentVersion {
  AgentVersion.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      agentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'agent_id',
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
      systemPrompt: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'system_prompt',
      },
      modelProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'model_profile_id',
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
    },
    {
      sequelize,
      tableName: 'agent_versions',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['agent_id', 'version'],
        },
      ],
    },
  );
  return AgentVersion;
}
