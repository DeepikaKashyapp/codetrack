const db = require('../config/db');

class LeaderboardRepository {
  async getTopUsersFromDB(limit = 100) {
    const query = `
      SELECT 
        u.id as "userId",
        u.username,
        COALESCE(SUM(
          CASE p.difficulty 
            WHEN 'Easy' THEN 1 
            WHEN 'Medium' THEN 3 
            WHEN 'Hard' THEN 5 
            ELSE 0 
          END
        ), 0) as score
      FROM users u
      JOIN user_solved_problems s ON u.id = s.user_id
      JOIN problems p ON s.problem_id = p.id
      GROUP BY u.id, u.username
      ORDER BY score DESC
      LIMIT $1;
    `;
    const { rows } = await db.query(query, [limit]);
    
    // Add rank
    return rows.map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      username: row.username,
      score: parseInt(row.score, 10)
    }));
  }

  async getUserRankFromDB(userId) {
    const query = `
      WITH UserScores AS (
        SELECT 
          u.id as "userId",
          COALESCE(SUM(
            CASE p.difficulty 
              WHEN 'Easy' THEN 1 
              WHEN 'Medium' THEN 3 
              WHEN 'Hard' THEN 5 
              ELSE 0 
            END
          ), 0) as score
        FROM users u
        JOIN user_solved_problems s ON u.id = s.user_id
        JOIN problems p ON s.problem_id = p.id
        GROUP BY u.id
      ),
      RankedUsers AS (
        SELECT 
          "userId", 
          score,
          RANK() OVER (ORDER BY score DESC) as rank
        FROM UserScores
      )
      SELECT rank, score FROM RankedUsers WHERE "userId" = $1;
    `;
    const { rows } = await db.query(query, [userId]);
    if (rows.length === 0) {
      return { rank: null, score: 0 };
    }
    return {
      rank: parseInt(rows[0].rank, 10),
      score: parseInt(rows[0].score, 10)
    };
  }
}

module.exports = new LeaderboardRepository();
