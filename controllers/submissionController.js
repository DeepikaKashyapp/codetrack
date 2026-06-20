const submissionService = require('../services/submissionService');
const executionService = require('../services/executionService');
const db = require('../config/db');

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
  async runCode(req, res, next) {
    try {
      const { code, problemId, language } = req.body;
      
      // Fetch test cases from database
      const query = 'SELECT test_cases FROM problems WHERE id = $1';
      const { rows } = await db.query(query, [problemId]);
      
      let testCases = [];
      if (rows.length > 0 && rows[0].test_cases) {
        testCases = rows[0].test_cases;
      }

      let result;
      if (language === 'cpp') {
        result = await executionService.executeCpp(code);
      } else {
        // We only run the first test case for "Run Code" (sample test case)
        const sampleTests = testCases.slice(0, 1);
        result = await executionService.executeJavaScript(code, sampleTests);
      }
      
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async submitCode(req, res, next) {
    try {
      const { code, problemId, language } = req.body;
      const userId = req.user.id;

      // Fetch all test cases
      const query = 'SELECT test_cases FROM problems WHERE id = $1';
      const { rows } = await db.query(query, [problemId]);
      
      let testCases = [];
      if (rows.length > 0 && rows[0].test_cases) {
        testCases = rows[0].test_cases;
      }

      let result;
      if (language === 'cpp') {
        result = await executionService.executeCpp(code);
      } else {
        result = await executionService.executeJavaScript(code, testCases);
      }

      // If all passed, we mark it as solved
      if (result.success && result.allPassed) {
        try {
          await submissionService.submitProblem(userId, problemId, `Solved via IDE (${language || 'javascript'})`);
        } catch (submitErr) {
          // Ignore "already solved" error
        }
      }

      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubmissionController();
