const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// get all profiles
router.get('/', async (req, res) => {
    console.log('Received Query:', req.query);
    try {
        const profiles = await Profile.find().select('user profileImage description');

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

const { generateTagsFromDescription } = require('../utils/tagging.js');
const Tag = require('../models/Tag');

// post new profiles
router.post('/:userId', async (req, res) => {
    const userId = req.params.userId; 
    const {
        profileImage,
        description // lowercase to match your schema
    } = req.body;
    
    const newProfile = new Profile({
        user: userId, 
        profileImage,
        description
    });

    try {
        // Step 1: save the profile
        const savedProfile = await newProfile.save();

        // Step 2: generate tags from description
        let tags = {};
        if (description) {
            tags = await generateTagsFromDescription(description);
        }

        // Step 3: save tags to DB if valid
        let savedTagSet = null;
        if (tags) {
            savedTagSet = await new Tag({ user: userId, ...tags }).save();
        }

        // Step 4: respond with both profile + tags
        res.status(201).json({ profile: savedProfile, tags: savedTagSet });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;
