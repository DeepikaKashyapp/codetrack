const problemRepository = require('../repositories/problemRepository');

class ProblemService {
  async createProblem(data) {
    const { title, slug, difficulty, platform, tags } = data;
    
    // Basic validation
    if (!title || !slug || !difficulty) {
      throw new Error('Title, slug, and difficulty are required');
    }

    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      throw new Error('Difficulty must be Easy, Medium, or Hard');
    }

    // Try creating problem
    try {
      return await problemRepository.create(title, slug, difficulty, platform, tags || []);
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('A problem with this slug already exists');
      }
      throw error;
    }
  }

  async getProblems(page = 1, limit = 20, difficulty, tagsString) {
    const offset = (page - 1) * limit;
    const tags = tagsString ? tagsString.split(',').map(t => t.trim()) : null;

    const result = await problemRepository.findAll(limit, offset, difficulty, tags);
    
    return {
      problems: result.data,
      pagination: {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / limit)
      }
    };
  }

  async getProblemById(id) {
    const problem = await problemRepository.findById(id);
    if (!problem) {
      throw new Error('Problem not found');
    }
    return problem;
  }
}

module.exports = new ProblemService();
