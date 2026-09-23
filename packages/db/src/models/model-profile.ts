import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ModelProfileAttributes {
  id: string;
  name: string;
  provider: string;
  model: string;
  apiBase?: string | null;
  config: Record<string, unknown>;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ModelProfileCreationAttributes extends Omit<
  ModelProfileAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class ModelProfile
  extends Model<ModelProfileAttributes, ModelProfileCreationAttributes>
  implements ModelProfileAttributes
{
  declare id: string;
  declare name: string;
  declare provider: string;
  declare model: string;
  declare apiBase: string | null;
  declare config: Record<string, unknown>;
  declare isDefault: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initModelProfileModel(sequelize: Sequelize): typeof ModelProfile {
  ModelProfile.init(
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
      provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      apiBase: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'api_base',
      },
      config: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_default',
      },
    },
    {
      sequelize,
      tableName: 'model_profiles',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return ModelProfile;
}
