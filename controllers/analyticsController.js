const analyticsService = require('../services/analyticsService');

class AnalyticsController {
  async getDailySubmissions(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await analyticsService.getDailySubmissions(userId);
      res.status(200).json({
        message: 'Daily submissions retrieved successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async getTopicBreakdown(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await analyticsService.getTopicBreakdown(userId);
      res.status(200).json({
        message: 'Topic breakdown retrieved successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
