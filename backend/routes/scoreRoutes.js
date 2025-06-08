const express = require('express');
const router = express.Router();
const { saveScore, getLeaderboard, getUserHighestScore } = require('../controllers/scoreControllers');
const auth = require('../middlewear/authMiddlewear');

router.post('/', auth, saveScore);
router.get('/', getLeaderboard);
router.get('/my-highest', auth, getUserHighestScore);

module.exports = router;