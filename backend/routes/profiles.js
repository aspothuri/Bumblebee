const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// get all profiles
router.get('/', async (req, res) => {
    console.log('Received Query:', req.query);
    try {
        const profiles = await Profile.find().select('user profileImage, description');

        const profileTuples = profiles.map(profileDoc => {
            const userId = profileDoc.user ? profileDoc.user.toString() : 'UNKNOWN_USER'; 
            
            const tuple = [
                userId,
                profileDoc.profileImage || '',
                profileDoc.description || ''
            ];
            return tuple;
        });

        res.status(200).json(profileTuples);
    } catch (error) {
        console.error('Error fetching profiless:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// post new profiles
router.post('/:userId', async (req, res) => {
    const userId = req.params.userId; 
    const {
    profileImage,
    Description
} = req.body;
    
    const newProfile = new Profile({
        user: userId, 
        profileImage,
        Description
    });

    try {
        const savedProfile = await newProfile.save();
        res.status(201).json(savedProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
