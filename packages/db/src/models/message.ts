import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface MessageAttributes {
  id: string;
  taskId: string;
  agentRunId?: string | null;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  metadata?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageCreationAttributes extends Omit<
  MessageAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  declare id: string;
  declare taskId: string;
  declare agentRunId: string | null;
  declare role: 'system' | 'user' | 'assistant' | 'tool';
  declare content: string;
  declare metadata: Record<string, unknown> | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initMessageModel(sequelize: Sequelize): typeof Message {
  Message.init(
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
      agentRunId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'agent_run_id',
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
    },
    {
      sequelize,
      tableName: 'messages',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['task_id', 'created_at'],
        },
      ],
    },
  );
  return Message;
}
