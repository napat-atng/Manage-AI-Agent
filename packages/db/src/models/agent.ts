import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface AgentAttributes {
  id: string;
  name: string;
  role: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AgentCreationAttributes extends Omit<
  AgentAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class Agent
  extends Model<AgentAttributes, AgentCreationAttributes>
  implements AgentAttributes
{
  declare id: string;
  declare name: string;
  declare role: string;
  declare description: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initAgentModel(sequelize: Sequelize): typeof Agent {
  Agent.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    },
    {
      sequelize,
      tableName: 'agents',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return Agent;
}
