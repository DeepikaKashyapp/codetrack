const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All analytics routes are protected
router.use(authMiddleware);

router.get('/daily', analyticsController.getDailySubmissions);
router.get('/topics', analyticsController.getTopicBreakdown);

module.exports = router;
