import { Umzug, SequelizeStorage } from 'umzug';
import type { Sequelize } from 'sequelize';
import * as initialSchema from './migrations/001_initial_schema.js';
import * as initialSeed from './seeders/001_initial_seed.js';

export function createMigrator(sequelize: Sequelize) {
  return new Umzug({
    migrations: [
      {
        name: '001_initial_schema',
        up: async () => initialSchema.up({ context: sequelize.getQueryInterface() }),
        down: async () => initialSchema.down({ context: sequelize.getQueryInterface() }),
      },
    ],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeMeta' }),
    logger: console,
  });
}

export function createSeeder(sequelize: Sequelize) {
  return new Umzug({
    migrations: [
      {
        name: '001_initial_seed',
        up: async () => initialSeed.up({ context: sequelize.getQueryInterface() }),
        down: async () => initialSeed.down({ context: sequelize.getQueryInterface() }),
      },
    ],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({
      sequelize,
      modelName: 'SequelizeData',
      tableName: 'SequelizeData',
    }),
    logger: console,
  });
}
