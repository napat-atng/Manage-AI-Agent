import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface SessionAttributes {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SessionCreationAttributes extends Omit<
  SessionAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class Session
  extends Model<SessionAttributes, SessionCreationAttributes>
  implements SessionAttributes
{
  declare id: string;
  declare userId: string;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initSessionModel(sequelize: Sequelize): typeof Session {
  Session.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      tokenHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'token_hash',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
      },
    },
    {
      sequelize,
      tableName: 'sessions',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['user_id'],
        },
        {
          fields: ['token_hash'],
        },
      ],
    },
  );
  return Session;
}
