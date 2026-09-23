import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface WorkflowAttributes {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkflowCreationAttributes extends Omit<
  WorkflowAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class Workflow
  extends Model<WorkflowAttributes, WorkflowCreationAttributes>
  implements WorkflowAttributes
{
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initWorkflowModel(sequelize: Sequelize): typeof Workflow {
  Workflow.init(
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
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'workflows',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return Workflow;
}
