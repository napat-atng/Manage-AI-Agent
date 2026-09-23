import { getSequelize } from '../connection.js';
import { createMigrator } from '../migrator.js';

async function main() {
  const action = process.argv[2] || 'up';
  const sequelize = getSequelize();
  const migrator = createMigrator(sequelize);

  try {
    if (action === 'down') {
      console.log('Rolling back last migration...');
      await migrator.down();
      console.log('Rollback complete.');
    } else {
      console.log('Running migrations...');
      await migrator.up();
      console.log('Migrations complete.');
    }
  } finally {
    await sequelize.close();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
