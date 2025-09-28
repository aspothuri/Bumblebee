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

    // If fullObject is requested, return full objects, otherwise return tuples
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

// post new users
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const newUser = new User({
        username,
        password,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
