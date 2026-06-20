const express = require('express');
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All submission routes should be protected
router.use(authMiddleware);

router.post('/', submissionController.submitProblem);
router.get('/my-submissions', submissionController.getUserSubmissions);

module.exports = router;
