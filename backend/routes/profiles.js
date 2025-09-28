const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// get all profiles
router.get('/', async (req, res) => {
    console.log('Received Query:', req.query);
    const {searchUserId} = req.query;
    const filter = {};
    if (searchUserId) {
      filter.user = searchUserId;
    }
    try {
        const profiles = await Profile.find(filter).select('user profileImage description');

        const profileTuples = profiles.map(profileDoc => {
            const userId = profileDoc.user ? profileDoc.user.toString() : 'UNKNOWN_USER'; 
            
            const tuple = [
                userId,
                profileDoc.profileImage || '',
                profileDoc.age || '',
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

const { generateTags } = require('../utils/tagging.js');
const Tag = require('../models/Tag');
const { getCompatibleUsers } = require('../utils/compatibility');

// post new profiles
router.post('/:userId', async (req, res) => {
    const userId = req.params.userId; 
    const {
    profileImage,
    age,
    Description
} = req.body;
    
    const newProfile = new Profile({
        user: userId, 
        profileImage,
        age,
        description: Description
    });

    try {
        // Step 1: save the profile
        const savedProfile = await newProfile.save();

        // Step 2: generate tags from description
        let tags = {};
        if (Description) {
            tags = await generateTags(Description);
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

router.get('/:userId/compatibility', async (req, res) => {
  try {
    const sortedUsers = await getCompatibleUsers(req.params.userId);
    res.json(sortedUsers); // returns array of { userId, compatibility }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
