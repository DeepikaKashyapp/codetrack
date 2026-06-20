const db = require('../config/db');

async function migrate() {
  try {
    await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token VARCHAR(500);');
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
