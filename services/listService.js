const listRepository = require('../repositories/listRepository');

class ListService {
  async getUserLists(userId) {
    // Ensure the user has the default "Favorite" and "To Do" lists initialized
    await listRepository.ensureDefaultLists(userId);
    return await listRepository.getUserLists(userId);
  }

  async createList(userId, name) {
    if (!name || name.trim() === '') {
      throw new Error('List name is required');
    }
    try {
      return await listRepository.createList(userId, name.trim(), false, 'list');
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('A list with this name already exists');
      }
      throw error;
    }
  }

  async addProblemToList(userId, listId, problemId) {
    // Verify list belongs to user
    const list = await listRepository.getListById(listId, userId);
    if (!list) {
      throw new Error('List not found or access denied');
    }

    const added = await listRepository.addProblemToList(listId, problemId);
    if (!added) {
      throw new Error('Problem is already in this list');
    }
    return added;
  }

  async removeProblemFromList(userId, listId, problemId) {
    const list = await listRepository.getListById(listId, userId);
    if (!list) {
      throw new Error('List not found or access denied');
    }

    const removed = await listRepository.removeProblemFromList(listId, problemId);
    if (!removed) {
      throw new Error('Problem not found in list');
    }
    return removed;
  }
}

module.exports = new ListService();
