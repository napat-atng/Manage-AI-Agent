import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Omit<
  UserAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare name: string;
  declare role: 'admin' | 'operator' | 'viewer';
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initUserModel(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'viewer',
      },
    },
    {
      sequelize,
      tableName: 'users',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return User;
}
