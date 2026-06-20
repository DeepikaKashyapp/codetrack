const db = require('../config/db');

async function createListsTables() {
  try {
    console.log('Creating user_lists and user_list_items tables...');

    await db.query(`
      CREATE TABLE IF NOT EXISTS user_lists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        icon VARCHAR(50) DEFAULT 'list',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, name)
      );

      CREATE TABLE IF NOT EXISTS user_list_items (
        list_id INTEGER REFERENCES user_lists(id) ON DELETE CASCADE,
        problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
        added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (list_id, problem_id)
      );

      CREATE INDEX IF NOT EXISTS idx_user_lists_user_id ON user_lists(user_id);
    `);

    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    process.exit();
  }
}

createListsTables();
