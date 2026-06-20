const db = require('../config/db');

async function migrate() {
  try {
    console.log('Adding code execution columns to problems table...');
    await db.query(`
      ALTER TABLE problems 
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS default_code TEXT,
      ADD COLUMN IF NOT EXISTS test_cases JSONB DEFAULT '[]'::jsonb;
    `);

    console.log('Columns added successfully.');

    // Seed dummy description and default code for existing problems
    console.log('Seeding existing problems with dummy content...');
    await db.query(`
      UPDATE problems 
      SET 
        description = '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p><p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>',
        default_code = 'function solve(nums, target) {\n  // Write your code here\n  \n}',
        test_cases = '[{"call": "solve([2,7,11,15], 9)", "expected": [0,1]}, {"call": "solve([3,2,4], 6)", "expected": [1,2]}]'::jsonb
      WHERE default_code IS NULL;
    `);

    console.log('Migration complete.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    process.exit();
  }
}

migrate();
