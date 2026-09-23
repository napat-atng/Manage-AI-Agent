import { Sequelize } from 'sequelize';

export function createSequelize(): Sequelize {
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = Number(process.env.POSTGRES_PORT || 5432);
  const database = process.env.POSTGRES_DB || 'aacc';
  const username = process.env.POSTGRES_USER || 'aacc';
  const password = process.env.POSTGRES_PASSWORD || 'aacc_dev_password';

  return new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'postgres',
    logging:
      process.env.NODE_ENV === 'test'
        ? false
        : (msg) => {
            if (process.env.DEBUG_SQL) {
              console.log(msg);
            }
          },
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

let sequelizeInstance: Sequelize | null = null;

export function getSequelize(): Sequelize {
  if (!sequelizeInstance) {
    sequelizeInstance = createSequelize();
  }
  return sequelizeInstance;
}
