const express = require('express');
const router = express.Router();
const User = require('../models/User');

// get all or filter users
router.get('/', async (req, res) => {
    console.log('Received Query:', req.query);
  try {
    const { search, passwordSearch, fullObject } = req.query;

    const filter = {};

    if (search && passwordSearch) {
      filter.username = search;
      filter.password = passwordSearch;
    } else if (search) {
      filter.username = search;
    } else if (passwordSearch) {
      filter.password = passwordSearch;
    }

    const users = await User.find(filter).select('_id username password');

    if (fullObject === 'true') {
      res.status(200).json(users);
    } else {
      const userTuples = users.map(user => [user.username, user.password]);
      res.status(200).json(userTuples);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update user data
router.put('/:userId', async (req, res) => {
  try {
    const { honey, currentColony, unlockedColonies } = req.body;
    const updateData = {};
    
    if (honey !== undefined) updateData.honey = honey;
    if (currentColony) updateData.currentColony = currentColony;
    if (unlockedColonies) updateData.unlockedColonies = unlockedColonies;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// post new users
router.post('/', async (req, res) => {
    const { username, password, email, name, location } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const newUser = new User({
        username,
        password,
        email,
        name,
        location,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
