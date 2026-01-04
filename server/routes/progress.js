const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.userId });
    
    if (!progress) {
      progress = new Progress({ userId: req.userId, completedQuestions: {} });
      await progress.save();
    }

    res.json({ completedQuestions: Object.fromEntries(progress.completedQuestions) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update progress (toggle question)
router.post('/toggle', auth, async (req, res) => {
  try {
    const { question } = req.body;

    let progress = await Progress.findOne({ userId: req.userId });
    
    if (!progress) {
      progress = new Progress({ userId: req.userId, completedQuestions: {} });
    }

    const currentStatus = progress.completedQuestions.get(question) || false;
    progress.completedQuestions.set(question, !currentStatus);
    
    await progress.save();

    res.json({ 
      question, 
      completed: !currentStatus,
      completedQuestions: Object.fromEntries(progress.completedQuestions)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk update progress
router.post('/bulk-update', auth, async (req, res) => {
  try {
    const { completedQuestions } = req.body;

    let progress = await Progress.findOne({ userId: req.userId });
    
    if (!progress) {
      progress = new Progress({ userId: req.userId });
    }

    progress.completedQuestions = new Map(Object.entries(completedQuestions));
    await progress.save();

    res.json({ 
      message: 'Progress updated successfully',
      completedQuestions: Object.fromEntries(progress.completedQuestions)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;