const leaderboardService = require('../services/leaderboardService');
const userRepository = require('../repositories/userRepository');
const leaderboardRepository = require('../repositories/leaderboardRepository');

class LeaderboardController {
  async getTopUsers(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      let topUsers = [];
      
      try {
        const topUsersRaw = await leaderboardService.getTopUsers(limit);
        // The Redis leaderboard only contains user IDs. Fetch usernames from DB.
        for (const item of topUsersRaw) {
          const user = await userRepository.findById(item.userId);
          if (user) {
            topUsers.push({
              rank: item.rank,
              userId: user.id,
              username: user.username,
              score: item.score
            });
          }
        }
      } catch (redisError) {
        console.warn('Redis failed, falling back to DB for getTopUsers');
        topUsers = await leaderboardRepository.getTopUsersFromDB(limit);
      }

      res.status(200).json({
        message: 'Leaderboard retrieved successfully',
        data: topUsers
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyRank(req, res, next) {
    try {
      const userId = req.user.id;
      let rankData;
      
      try {
        rankData = await leaderboardService.getUserRank(userId);
      } catch (redisError) {
        console.warn('Redis failed, falling back to DB for getMyRank');
        rankData = await leaderboardRepository.getUserRankFromDB(userId);
      }
      
      res.status(200).json({
        message: 'User rank retrieved successfully',
        data: rankData
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeaderboardController();
