const redisClient = require('../config/redis');

class LeaderboardService {
  constructor() {
    this.leaderboardKey = 'leaderboard';
  }

  async addPoints(userId, points) {
    try {
      await redisClient.zIncrBy(this.leaderboardKey, points, userId.toString());
    } catch (error) {
      console.error('Redis Leaderboard update failed:', error);
      // In a production app, we might want a dead-letter queue or retry mechanism
      // For now, we will rely on the background sync job to fix inconsistencies
    }
  }

  async getTopUsers(limit = 100) {
    try {
      // zRevRangeWithScores returns elements ordered from highest to lowest score
      const result = await redisClient.zRangeWithScores(this.leaderboardKey, 0, limit - 1, {
        REV: true
      });
      return result.map((item, index) => ({
        rank: index + 1,
        userId: item.value,
        score: item.score
      }));
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      throw error;
    }
  }

  async getUserRank(userId) {
    try {
      const rank = await redisClient.zRevRank(this.leaderboardKey, userId.toString());
      const score = await redisClient.zScore(this.leaderboardKey, userId.toString());
      
      return {
        rank: rank !== null ? rank + 1 : null,
        score: score ? parseFloat(score) : 0
      };
    } catch (error) {
      console.error('Failed to get user rank:', error);
      throw error;
    }
  }
}

module.exports = new LeaderboardService();
