const analyticsRepository = require('../repositories/analyticsRepository');

class AnalyticsService {
  async getDailySubmissions(userId) {
    const records = await analyticsRepository.getDailySubmissions(userId);
    // Format dates to string
    return records.map(r => ({
      date: new Date(r.date).toISOString().split('T')[0],
      count: parseInt(r.count, 10)
    }));
  }

  async getTopicBreakdown(userId) {
    const records = await analyticsRepository.getTopicBreakdown(userId);
    return records.map(r => ({
      topic: r.topic,
      count: parseInt(r.count, 10)
    }));
  }
}

module.exports = new AnalyticsService();
