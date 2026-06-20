const db = require('../config/db');

class ListRepository {
  // Create a new list for a user
  async createList(userId, name, isDefault = false, icon = 'list') {
    const query = `
      INSERT INTO user_lists (user_id, name, is_default, icon)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, name, isDefault, icon]);
    return rows[0];
  }

  // Get all lists for a user
  async getUserLists(userId) {
    const query = `
      SELECT * FROM user_lists
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at ASC;
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  }

  // Get a specific list
  async getListById(listId, userId) {
    const query = 'SELECT * FROM user_lists WHERE id = $1 AND user_id = $2;';
    const { rows } = await db.query(query, [listId, userId]);
    return rows[0];
  }

  // Add a problem to a list
  async addProblemToList(listId, problemId) {
    const query = `
      INSERT INTO user_list_items (list_id, problem_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *;
    `;
    const { rows } = await db.query(query, [listId, problemId]);
    return rows[0] || null; // Returns null if conflict (already exists)
  }

  // Remove a problem from a list
  async removeProblemFromList(listId, problemId) {
    const query = `
      DELETE FROM user_list_items
      WHERE list_id = $1 AND problem_id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [listId, problemId]);
    return rows[0];
  }

  // Check if user has default lists, create if not
  async ensureDefaultLists(userId) {
    const query = 'SELECT count(*) FROM user_lists WHERE user_id = $1 AND is_default = TRUE;';
    const { rows } = await db.query(query, [userId]);
    
    if (parseInt(rows[0].count, 10) === 0) {
      // Create defaults
      await this.createList(userId, 'Favorite', true, 'star');
      await this.createList(userId, 'To Do', true, 'clipboard');
    }
  }
}

module.exports = new ListRepository();
