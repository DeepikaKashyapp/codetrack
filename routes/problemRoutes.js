const express = require('express');
const problemController = require('../controllers/problemController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', problemController.getProblems);
router.get('/:id', problemController.getProblem);

// Protected routes (Admin level typically, but requiring Auth for now)
router.post('/', authMiddleware, problemController.createProblem);

module.exports = router;
