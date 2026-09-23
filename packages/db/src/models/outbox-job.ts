import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface OutboxJobAttributes {
  id: string;
  eventId?: string | null;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  lastError?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OutboxJobCreationAttributes extends Omit<
  OutboxJobAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'retryCount'
> {
  id?: string;
  retryCount?: number;
}

export class OutboxJob
  extends Model<OutboxJobAttributes, OutboxJobCreationAttributes>
  implements OutboxJobAttributes
{
  declare id: string;
  declare eventId: string | null;
  declare aggregateType: string;
  declare aggregateId: string;
  declare payload: Record<string, unknown>;
  declare status: 'pending' | 'processing' | 'completed' | 'failed';
  declare retryCount: number;
  declare lastError: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initOutboxJobModel(sequelize: Sequelize): typeof OutboxJob {
  OutboxJob.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'event_id',
        references: {
          model: 'events',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      aggregateType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'aggregate_type',
      },
      aggregateId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'aggregate_id',
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
      retryCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'retry_count',
      },
      lastError: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'last_error',
      },
    },
    {
      sequelize,
      tableName: 'outbox_jobs',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['status', 'created_at'],
        },
      ],
    },
  );
  return OutboxJob;
}
