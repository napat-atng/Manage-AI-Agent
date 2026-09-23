import type { Sequelize, Transaction } from 'sequelize';
import { OutboxJob, type OutboxJobCreationAttributes } from './models/outbox-job.js';

export interface OutboxOperationResult<T> {
  result: T;
  outbox?: OutboxJobCreationAttributes | OutboxJobCreationAttributes[];
}

export async function withOutboxTransaction<T>(
  sequelize: Sequelize,
  operation: (transaction: Transaction) => Promise<OutboxOperationResult<T>>,
): Promise<T> {
  const transaction = await sequelize.transaction();
  try {
    const { result, outbox } = await operation(transaction);

    if (outbox) {
      const jobs = Array.isArray(outbox) ? outbox : [outbox];
      if (jobs.length > 0) {
        await OutboxJob.bulkCreate(jobs, { transaction });
      }
    }

    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
