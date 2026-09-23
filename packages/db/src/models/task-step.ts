import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface TaskStepAttributes {
  id: string;
  taskId: string;
  stepIndex: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input?: Record<string, unknown> | null;
  output?: Record<string, unknown> | null;
  error?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskStepCreationAttributes extends Omit<
  TaskStepAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {
  id?: string;
}

export class TaskStep
  extends Model<TaskStepAttributes, TaskStepCreationAttributes>
  implements TaskStepAttributes
{
  declare id: string;
  declare taskId: string;
  declare stepIndex: number;
  declare name: string;
  declare status: 'pending' | 'running' | 'completed' | 'failed';
  declare input: Record<string, unknown> | null;
  declare output: Record<string, unknown> | null;
  declare error: Record<string, unknown> | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initTaskStepModel(sequelize: Sequelize): typeof TaskStep {
  TaskStep.init(
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
      stepIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'step_index',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'pending',
      },
      input: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      output: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      error: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'task_steps',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['task_id', 'step_index'],
        },
      ],
    },
  );
  return TaskStep;
}
