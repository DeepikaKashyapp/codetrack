const db = require('../config/db');

class AnalyticsRepository {
  async getDailySubmissions(userId) {
    const query = `
      SELECT 
        DATE(solved_at) as date,
        COUNT(*) as count
      FROM user_solved_problems
      WHERE user_id = $1
      GROUP BY DATE(solved_at)
      ORDER BY date ASC;
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  }

  async getTopicBreakdown(userId) {
    const query = `
      SELECT 
        UNNEST(p.tags) as topic,
        COUNT(*) as count
      FROM user_solved_problems s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = $1
      GROUP BY UNNEST(p.tags)
      ORDER BY count DESC;
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  }
}

module.exports = new AnalyticsRepository();
