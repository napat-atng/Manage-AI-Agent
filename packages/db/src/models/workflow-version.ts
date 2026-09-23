import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface WorkflowVersionAttributes {
  id: string;
  workflowId: string;
  version: number;
  definition: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkflowVersionCreationAttributes extends Omit<
  WorkflowVersionAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class WorkflowVersion
  extends Model<WorkflowVersionAttributes, WorkflowVersionCreationAttributes>
  implements WorkflowVersionAttributes
{
  declare id: string;
  declare workflowId: string;
  declare version: number;
  declare definition: Record<string, unknown>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initWorkflowVersionModel(sequelize: Sequelize): typeof WorkflowVersion {
  WorkflowVersion.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      workflowId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'workflow_id',
        references: {
          model: 'workflows',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      definition: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'workflow_versions',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['workflow_id', 'version'],
        },
      ],
    },
  );
  return WorkflowVersion;
}
