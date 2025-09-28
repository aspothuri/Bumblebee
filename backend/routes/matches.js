const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Simple match schema
const matchSchema = new mongoose.Schema({
  user1Id: { type: String, required: true },
  user2Id: { type: String, required: true },
  matchedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate matches
matchSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });

const Match = mongoose.model('Match', matchSchema);

// POST /matches - Log a new match
router.post('/', async (req, res) => {
  const { user1Id, user2Id, matchedAt } = req.body;

  console.log('Received match request:', { user1Id, user2Id });

  if (!user1Id || !user2Id) {
    return res.status(400).json({ message: 'Both user1Id and user2Id are required.' });
  }

  if (user1Id === user2Id) {
    return res.status(400).json({ message: 'Cannot match a user with themselves.' });
  }

  try {
    // Check if match already exists (either direction)
    const existingMatch = await Match.findOne({
      $or: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id }
      ]
    });

    if (existingMatch) {
      console.log('Match already exists:', existingMatch);
      return res.status(200).json({ message: 'Match already exists', match: existingMatch });
    }

    // Create new match
    const newMatch = new Match({
      user1Id,
      user2Id,
      matchedAt: matchedAt || new Date()
    });

    const savedMatch = await newMatch.save();
    console.log('Match created successfully:', savedMatch);
    
    res.status(201).json({ message: 'Match logged successfully', match: savedMatch });

  } catch (error) {
    console.error('Error logging match:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(200).json({ message: 'Match already exists' });
    }
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /matches/:userId - Get all matches for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  console.log('Fetching matches for user:', userId);

  try {
    const matches = await Match.find({
      $or: [
        { user1Id: userId },
        { user2Id: userId }
      ],
      isActive: true
    }).sort({ createdAt: -1 });

    console.log(`Found ${matches.length} matches for user ${userId}`);
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /matches/:matchId - Remove a match
router.delete('/:matchId', async (req, res) => {
  const { matchId } = req.params;

  try {
    const deletedMatch = await Match.findByIdAndUpdate(
      matchId,
      { isActive: false },
      { new: true }
    );

    if (!deletedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.status(200).json({ message: 'Match removed successfully', match: deletedMatch });
  } catch (error) {
    console.error('Error removing match:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
