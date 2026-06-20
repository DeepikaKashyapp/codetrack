const problemService = require('../services/problemService');

class ProblemController {
  async createProblem(req, res, next) {
    try {
      const problem = await problemService.createProblem(req.body);
      res.status(201).json({
        message: 'Problem created successfully',
        data: problem
      });
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('required') || error.message.includes('must be')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  async getProblems(req, res, next) {
    try {
      const { page, limit, difficulty, tags } = req.query;
      const result = await problemService.getProblems(page, limit, difficulty, tags);
      res.status(200).json({
        message: 'Problems retrieved successfully',
        data: result.problems,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getProblem(req, res, next) {
    try {
      const { id } = req.params;
      const problem = await problemService.getProblemById(id);
      res.status(200).json({
        message: 'Problem retrieved successfully',
        data: problem
      });
    } catch (error) {
      if (error.message === 'Problem not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }
}

module.exports = new ProblemController();
