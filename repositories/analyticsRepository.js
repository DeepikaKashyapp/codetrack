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
  async getProfileStats(userId) {
    // 1. Get breakdown of solved problems by difficulty
    const statsQuery = `
      SELECT p.difficulty, COUNT(*) as count
      FROM user_solved_problems usp
      JOIN problems p ON usp.problem_id = p.id
      WHERE usp.user_id = $1
      GROUP BY p.difficulty;
    `;
    const { rows: statsRows } = await db.query(statsQuery, [userId]);
    
    // 2. Get recent submissions (last 10)
    const recentQuery = `
      SELECT usp.problem_id as id, p.title as problem, p.difficulty, 'Accepted' as status, 'JavaScript' as language, usp.solved_at as time
      FROM user_solved_problems usp
      JOIN problems p ON usp.problem_id = p.id
      WHERE usp.user_id = $1
      ORDER BY usp.solved_at DESC
      LIMIT 10;
    `;
    const { rows: recentRows } = await db.query(recentQuery, [userId]);

    return {
      stats: statsRows,
      recent: recentRows
    };
  }
}

module.exports = new AnalyticsRepository();
