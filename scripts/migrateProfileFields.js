const db = require('../config/db');

async function migrate() {
  try {
    console.log('Starting profile fields migration...');
    
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS location VARCHAR(255),
      ADD COLUMN IF NOT EXISTS github_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS leetcode_url VARCHAR(255);
    `);
    
    console.log('Migration successful: Added bio, location, github_url, leetcode_url to users table.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

migrate();
