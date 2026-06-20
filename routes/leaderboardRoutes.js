const express = require('express');
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', leaderboardController.getTopUsers);
// Protected route to get own rank
router.get('/my-rank', authMiddleware, leaderboardController.getMyRank);

module.exports = router;
