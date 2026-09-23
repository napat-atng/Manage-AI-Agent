import type { Sequelize } from 'sequelize';
import { User, initUserModel } from './user.js';
import { Session, initSessionModel } from './session.js';
import { ModelProfile, initModelProfileModel } from './model-profile.js';
import { Agent, initAgentModel } from './agent.js';
import { AgentVersion, initAgentVersionModel } from './agent-version.js';
import { Tool, initToolModel } from './tool.js';
import { AgentTool, initAgentToolModel } from './agent-tool.js';
import { Workflow, initWorkflowModel } from './workflow.js';
import { WorkflowVersion, initWorkflowVersionModel } from './workflow-version.js';
import { Task, initTaskModel } from './task.js';
import { TaskStep, initTaskStepModel } from './task-step.js';
import { AgentRun, initAgentRunModel } from './agent-run.js';
import { ToolRun, initToolRunModel } from './tool-run.js';
import { Message, initMessageModel } from './message.js';
import { Event, initEventModel } from './event.js';
import { OutboxJob, initOutboxJobModel } from './outbox-job.js';

export function initModels(sequelize: Sequelize) {
  initUserModel(sequelize);
  initSessionModel(sequelize);
  initModelProfileModel(sequelize);
  initAgentModel(sequelize);
  initAgentVersionModel(sequelize);
  initToolModel(sequelize);
  initAgentToolModel(sequelize);
  initWorkflowModel(sequelize);
  initWorkflowVersionModel(sequelize);
  initTaskModel(sequelize);
  initTaskStepModel(sequelize);
  initAgentRunModel(sequelize);
  initToolRunModel(sequelize);
  initMessageModel(sequelize);
  initEventModel(sequelize);
  initOutboxJobModel(sequelize);

  // Associations
  User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' });
  Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
  Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  ModelProfile.hasMany(AgentVersion, {
    foreignKey: 'modelProfileId',
    as: 'agentVersions',
  });
  AgentVersion.belongsTo(ModelProfile, {
    foreignKey: 'modelProfileId',
    as: 'modelProfile',
  });

  Agent.hasMany(AgentVersion, { foreignKey: 'agentId', as: 'versions' });
  AgentVersion.belongsTo(Agent, { foreignKey: 'agentId', as: 'agent' });

  AgentVersion.belongsToMany(Tool, {
    through: AgentTool,
    foreignKey: 'agentVersionId',
    otherKey: 'toolId',
    as: 'tools',
  });
  Tool.belongsToMany(AgentVersion, {
    through: AgentTool,
    foreignKey: 'toolId',
    otherKey: 'agentVersionId',
    as: 'agentVersions',
  });

  Workflow.hasMany(WorkflowVersion, {
    foreignKey: 'workflowId',
    as: 'versions',
  });
  WorkflowVersion.belongsTo(Workflow, {
    foreignKey: 'workflowId',
    as: 'workflow',
  });

  WorkflowVersion.hasMany(Task, {
    foreignKey: 'workflowVersionId',
    as: 'tasks',
  });
  Task.belongsTo(WorkflowVersion, {
    foreignKey: 'workflowVersionId',
    as: 'workflowVersion',
  });

  Task.hasMany(TaskStep, { foreignKey: 'taskId', as: 'steps' });
  TaskStep.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

  Task.hasMany(AgentRun, { foreignKey: 'taskId', as: 'agentRuns' });
  AgentRun.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

  TaskStep.hasMany(AgentRun, { foreignKey: 'stepId', as: 'agentRuns' });
  AgentRun.belongsTo(TaskStep, { foreignKey: 'stepId', as: 'step' });

  AgentVersion.hasMany(AgentRun, {
    foreignKey: 'agentVersionId',
    as: 'runs',
  });
  AgentRun.belongsTo(AgentVersion, {
    foreignKey: 'agentVersionId',
    as: 'agentVersion',
  });

  AgentRun.hasMany(ToolRun, { foreignKey: 'agentRunId', as: 'toolRuns' });
  ToolRun.belongsTo(AgentRun, { foreignKey: 'agentRunId', as: 'agentRun' });

  Tool.hasMany(ToolRun, { foreignKey: 'toolId', as: 'runs' });
  ToolRun.belongsTo(Tool, { foreignKey: 'toolId', as: 'tool' });

  Task.hasMany(Message, { foreignKey: 'taskId', as: 'messages' });
  Message.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

  AgentRun.hasMany(Message, { foreignKey: 'agentRunId', as: 'messages' });
  Message.belongsTo(AgentRun, { foreignKey: 'agentRunId', as: 'agentRun' });

  Task.hasMany(Event, { foreignKey: 'taskId', as: 'events' });
  Event.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

  Event.hasMany(OutboxJob, { foreignKey: 'eventId', as: 'outboxJobs' });
  OutboxJob.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

  return {
    User,
    Session,
    ModelProfile,
    Agent,
    AgentVersion,
    Tool,
    AgentTool,
    Workflow,
    WorkflowVersion,
    Task,
    TaskStep,
    AgentRun,
    ToolRun,
    Message,
    Event,
    OutboxJob,
  };
}

export * from './user.js';
export * from './session.js';
export * from './model-profile.js';
export * from './agent.js';
export * from './agent-version.js';
export * from './tool.js';
export * from './agent-tool.js';
export * from './workflow.js';
export * from './workflow-version.js';
export * from './task.js';
export * from './task-step.js';
export * from './agent-run.js';
export * from './tool-run.js';
export * from './message.js';
export * from './event.js';
export * from './outbox-job.js';
