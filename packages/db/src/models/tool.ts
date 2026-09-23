import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ToolAttributes {
  id: string;
  name: string;
  description: string;
  schema: Record<string, unknown>;
  policy: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ToolCreationAttributes extends Omit<
  ToolAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class Tool extends Model<ToolAttributes, ToolCreationAttributes> implements ToolAttributes {
  declare id: string;
  declare name: string;
  declare description: string;
  declare schema: Record<string, unknown>;
  declare policy: Record<string, unknown>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initToolModel(sequelize: Sequelize): typeof Tool {
  Tool.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      schema: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      policy: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'tools',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return Tool;
}
