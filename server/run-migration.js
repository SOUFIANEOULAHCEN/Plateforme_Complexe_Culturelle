import { up } from './migrations/add_email_notifications.js';

const runMigration = async () => {
  try {
    await up();
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration(); 