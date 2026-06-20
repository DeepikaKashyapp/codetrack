const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // Protect all user routes

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;
