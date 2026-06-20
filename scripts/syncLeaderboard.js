const cron = require('node-cron');
const db = require('../config/db');
const redisClient = require('../config/redis');
const submissionService = require('../services/submissionService');

async function syncLeaderboard() {
  console.log('[Sync Job] Starting Leaderboard Sync from PostgreSQL to Redis...');
  try {
    // 1. Get all submissions with difficulty
    const query = `
      SELECT s.user_id, p.difficulty
      FROM user_solved_problems s
      JOIN problems p ON s.problem_id = p.id;
    `;
    const { rows } = await db.query(query);

    // 2. Calculate scores
    const userScores = {};
    for (const row of rows) {
      const points = submissionService.getPointsForDifficulty(row.difficulty);
      if (!userScores[row.user_id]) {
        userScores[row.user_id] = 0;
      }
      userScores[row.user_id] += points;
    }

    // 3. Clear existing leaderboard and populate new one
    // We could use a temporary key and rename it to avoid downtime, 
    // but for simplicity we will just clear and add.
    const leaderboardKey = 'leaderboard';
    await redisClient.del(leaderboardKey);

    for (const [userId, score] of Object.entries(userScores)) {
      await redisClient.zAdd(leaderboardKey, { score, value: userId.toString() });
    }

    console.log(`[Sync Job] Leaderboard synced successfully! Synced ${Object.keys(userScores).length} users.`);
  } catch (error) {
    console.error('[Sync Job] Error syncing leaderboard:', error);
  }
}

function startSyncJob() {
  cron.schedule('*/15 * * * *', syncLeaderboard);
  console.log('[Sync Job] Leaderboard sync cron scheduled (every 15 mins).');
}

module.exports = {
  syncLeaderboard,
  startSyncJob
};
