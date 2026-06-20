const express = require('express');
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All submission routes should be protected
router.use(authMiddleware);

router.post('/', submissionController.submitProblem);
router.get('/user', submissionController.getUserSubmissions);
router.post('/run', submissionController.runCode);
router.post('/submit', submissionController.submitCode);

module.exports = router;
