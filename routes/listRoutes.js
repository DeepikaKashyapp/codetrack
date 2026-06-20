const express = require('express');
const listController = require('../controllers/listController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // All list routes require authentication

router.get('/', listController.getUserLists);
router.post('/', listController.createList);
router.get('/:id', listController.getListDetails);
router.post('/add', listController.addProblemToList);

module.exports = router;
