import { getSequelize } from '../connection.js';
import { createSeeder } from '../migrator.js';

async function main() {
  const sequelize = getSequelize();
  const seeder = createSeeder(sequelize);

  try {
    console.log('Running database seeds...');
    await seeder.up();
    console.log('Seeding complete.');
  } finally {
    await sequelize.close();
  }
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
