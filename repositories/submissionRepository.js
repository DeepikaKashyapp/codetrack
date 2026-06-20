const db = require('../config/db');

class SubmissionRepository {
  async submitProblem(userId, problemId, notes, client) {
    const query = `
      INSERT INTO user_solved_problems (user_id, problem_id, notes)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, problem_id) DO NOTHING
      RETURNING *;
    `;
    const values = [userId, problemId, notes || null];
    const dbClient = client || db;
    const { rows } = await dbClient.query(query, values);
    
    // If rows.length is 0, it means the ON CONFLICT clause triggered
    // meaning the user already solved this problem.
    return rows.length > 0 ? rows[0] : null;
  }

  async getSubmissionsByUser(userId, limit = 20, offset = 0) {
    const query = `
      SELECT s.*, p.title, p.difficulty, p.platform
      FROM user_solved_problems s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = $1
      ORDER BY s.solved_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const { rows } = await db.query(query, [userId, limit, offset]);
    
    const countQuery = 'SELECT COUNT(*) FROM user_solved_problems WHERE user_id = $1';
    const { rows: countRows } = await db.query(countQuery, [userId]);
    
    return {
      data: rows,
      total: parseInt(countRows[0].count, 10)
    };
  }
}

module.exports = new SubmissionRepository();
