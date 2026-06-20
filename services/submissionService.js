const submissionRepository = require('../repositories/submissionRepository');
const problemService = require('./problemService');
const leaderboardService = require('./leaderboardService');

class SubmissionService {
  getPointsForDifficulty(difficulty) {
    switch (difficulty) {
      case 'Easy': return 1;
      case 'Medium': return 3;
      case 'Hard': return 5;
      default: return 0;
    }
  }

  async submitProblem(userId, problemId, notes) {
    const db = require('../config/db');
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // 1. Check if problem exists and get its difficulty
      const problem = await problemService.getProblemById(problemId);
      
      // 2. Try inserting submission into DB
      const submission = await submissionRepository.submitProblem(userId, problemId, notes, client);
      
      // If submission is null, it means it was a duplicate (ON CONFLICT DO NOTHING triggered)
      if (!submission) {
        throw new Error('You have already solved this problem');
      }

      await client.query('COMMIT');

      // 3. Calculate points and update leaderboard in Redis
      // Note: Redis update is outside DB transaction. If this fails, the DB is still the source of truth.
      const points = this.getPointsForDifficulty(problem.difficulty);
      await leaderboardService.addPoints(userId, points);

      return {
        submission,
        pointsEarned: points
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserSubmissions(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await submissionRepository.getSubmissionsByUser(userId, limit, offset);
    
    return {
      submissions: result.data,
      pagination: {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / limit)
      }
    };
  }
}

module.exports = new SubmissionService();
