import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface EventAttributes {
  id: string;
  taskId: string;
  sequence: number;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt?: Date;
}

export interface EventCreationAttributes extends Omit<EventAttributes, 'id' | 'createdAt'> {
  id?: string;
}

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  declare id: string;
  declare taskId: string;
  declare sequence: number;
  declare eventType: string;
  declare payload: Record<string, unknown>;
  declare createdAt: Date;
}

export function initEventModel(sequelize: Sequelize): typeof Event {
  Event.init(
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
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eventType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'event_type',
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    },
    {
      sequelize,
      tableName: 'events',
      underscored: true,
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['task_id', 'sequence'],
        },
      ],
    },
  );
  return Event;
}
