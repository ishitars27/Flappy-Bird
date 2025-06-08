const Score = require('../models/scoreModel');
const User = require('../models/userModel');

// Save a user's score
const saveScore = async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.user.id; // Assuming req.user.id is set by authMiddleware

    if (!score || score < 0) {
      return res.status(400).json({ success: false, message: 'Invalid score' });
    }

    // Create a new score entry
    const newScore = new Score({
      user: userId,
      score: score,
    });

    await newScore.save();

    // Update user's highest score if current score is higher
    const user = await User.findById(userId);
    if (user) {
      if (!user.highestScore || score > user.highestScore) {
        user.highestScore = score;
        await user.save();
      }
    }

    res.status(201).json({ success: true, message: 'Score saved successfully', score: newScore });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all scores for the leaderboard (sorted highest to lowest)
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .populate('user', 'name') // Populate user name
      .sort({ score: -1, createdAt: 1 }) // Sort by score descending, then by creation date ascending
      .limit(10); // Limit to top 10, adjust as needed

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a specific user's highest score
const getUserHighestScore = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user.id is set by authMiddleware

    const user = await User.findById(userId).select('highestScore');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, highestScore: user.highestScore || 0 });
  } catch (error) {
    console.error('Error fetching user highest score:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { saveScore, getLeaderboard, getUserHighestScore };