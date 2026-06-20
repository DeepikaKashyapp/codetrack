const listService = require('../services/listService');

class ListController {
  async getUserLists(req, res, next) {
    try {
      const userId = req.user.id;
      const lists = await listService.getUserLists(userId);
      res.status(200).json({
        message: 'Lists retrieved successfully',
        data: lists
      });
    } catch (error) {
      next(error);
    }
  }

  async createList(req, res, next) {
    try {
      const userId = req.user.id;
      const { name } = req.body;
      const newList = await listService.createList(userId, name);
      res.status(201).json({
        message: 'List created successfully',
        data: newList
      });
    } catch (error) {
      if (error.message.includes('required') || error.message.includes('exists')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  async getListDetails(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const listDetails = await listService.getListDetails(userId, id);
      res.status(200).json({
        message: 'List details retrieved successfully',
        data: listDetails
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  async addProblemToList(req, res, next) {
    try {
      const userId = req.user.id;
      const { listId, problemId } = req.body;
      
      if (!listId || !problemId) {
        return res.status(400).json({ error: 'listId and problemId are required' });
      }

      const added = await listService.addProblemToList(userId, listId, problemId);
      res.status(201).json({
        message: 'Problem added to list successfully',
        data: added
      });
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('already in this list')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }
}

module.exports = new ListController();
