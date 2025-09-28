const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Colony definitions
const colonies = {
    honeycomb: { name: "Honeycomb Heights", color: "#ffc107", unlocked: true, cost: 0 },
    meadow: { name: "Meadow Fields", color: "#4caf50", unlocked: false, cost: 15 },
    sunset: { name: "Sunset Valley", color: "#ff9800", unlocked: false, cost: 20 },
    crystal: { name: "Crystal Gardens", color: "#2196f3", unlocked: false, cost: 25 },
    forest: { name: "Whispering Woods", color: "#795548", unlocked: false, cost: 30 },
    ocean: { name: "Ocean Breeze", color: "#00bcd4", unlocked: false, cost: 35 }
};

// GET /colonies - Get all colonies
router.get('/', (req, res) => {
    try {
        res.status(200).json(colonies);
    } catch (error) {
        console.error('Error fetching colonies:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /colonies/:userId - Get user's colony status
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            currentColony: user.currentColony,
            unlockedColonies: user.unlockedColonies,
            honey: user.honey
        });
    } catch (error) {
        console.error('Error fetching user colony status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /colonies/:userId/change - Change user's current colony
router.post('/:userId/change', async (req, res) => {
    try {
        const { colonyId } = req.body;
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!colonies[colonyId]) {
            return res.status(400).json({ message: 'Invalid colony ID' });
        }

        if (!user.unlockedColonies.includes(colonyId)) {
            return res.status(400).json({ message: 'Colony not unlocked' });
        }

        user.currentColony = colonyId;
        await user.save();

        res.status(200).json({
            message: 'Colony changed successfully',
            currentColony: user.currentColony
        });
    } catch (error) {
        console.error('Error changing colony:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /colonies/:userId/unlock - Unlock a new colony
router.post('/:userId/unlock', async (req, res) => {
    try {
        const { colonyId } = req.body;
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!colonies[colonyId]) {
            return res.status(400).json({ message: 'Invalid colony ID' });
        }

        if (user.unlockedColonies.includes(colonyId)) {
            return res.status(400).json({ message: 'Colony already unlocked' });
        }

        const colony = colonies[colonyId];
        if (user.honey < colony.cost) {
            return res.status(400).json({
                message: `Not enough honey. Need ${colony.cost}, have ${user.honey}`
            });
        }

        // Check if user has unlocked adjacent colonies
        const mapLayout = {
            honeycomb: { connections: ['meadow', 'sunset'] },
            meadow: { connections: ['honeycomb', 'forest'] },
            sunset: { connections: ['honeycomb', 'crystal'] },
            crystal: { connections: ['sunset', 'ocean'] },
            forest: { connections: ['meadow', 'ocean'] },
            ocean: { connections: ['forest', 'crystal'] }
        };

        const isAccessible = mapLayout[colonyId].connections.some(
            connectedId => user.unlockedColonies.includes(connectedId)
        );

        if (!isAccessible) {
            return res.status(400).json({ message: 'Must unlock adjacent colonies first' });
        }

        // Deduct honey and unlock colony
        user.honey -= colony.cost;
        user.unlockedColonies.push(colonyId);
        await user.save();

        res.status(200).json({
            message: 'Colony unlocked successfully',
            unlockedColonies: user.unlockedColonies,
            honey: user.honey
        });
    } catch (error) {
        console.error('Error unlocking colony:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /colonies/:userId/honey - Add honey to user
router.post('/:userId/honey', async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.honey += amount || 0;
        await user.save();

        res.status(200).json({
            message: 'Honey added successfully',
            honey: user.honey
        });
    } catch (error) {
        console.error('Error adding honey:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
