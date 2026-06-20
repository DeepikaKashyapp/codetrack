const submissionService = require('../services/submissionService');

class SubmissionController {
  async submitProblem(req, res, next) {
    try {
      const { problemId, notes } = req.body;
      const userId = req.user.id; // from auth middleware

      if (!problemId) {
        return res.status(400).json({ error: 'Problem ID is required' });
      }

      const result = await submissionService.submitProblem(userId, problemId, notes);
      
      res.status(201).json({
        message: 'Problem marked as solved successfully',
        data: result
      });
    } catch (error) {
      if (error.message === 'You have already solved this problem') {
        return res.status(409).json({ error: error.message });
      }
      if (error.message === 'Problem not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async getUserSubmissions(req, res, next) {
    try {
      const userId = req.user.id; // Only getting their own submissions for now
      const { page, limit } = req.query;

      const result = await submissionService.getUserSubmissions(userId, page, limit);
      
      res.status(200).json({
        message: 'Submissions retrieved successfully',
        data: result.submissions,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubmissionController();
