const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// get all profiles
router.get('/', async (req, res) => {
    console.log('Profiles: Received Query:', req.query);
    const {searchUserId} = req.query;
    const filter = {};
    if (searchUserId) {
      filter.user = searchUserId;
      console.log('Profiles: Searching for specific user:', searchUserId);
    } else {
      console.log('Profiles: Fetching all profiles');
    }
    
    try {
        const profiles = await Profile.find(filter).select('user profileImage age description name email location');
        console.log('Profiles: Found', profiles.length, 'profiles in database');
        
        if (profiles.length > 0) {
          console.log('Profiles: Sample profile:', profiles[0]);
        }

        const profileTuples = profiles.map(profileDoc => {
            const userId = profileDoc.user ? profileDoc.user.toString() : 'UNKNOWN_USER'; 
            
            const tuple = [
                userId,
                profileDoc.profileImage || '',
                profileDoc.age || '',
                profileDoc.description || '',
                profileDoc.name || '',
                profileDoc.email || '',
                profileDoc.location || ''
            ];
            return tuple;
        });

        console.log('Profiles: Returning', profileTuples.length, 'profile tuples');
        res.status(200).json(profileTuples);
    } catch (error) {
        console.error('Error fetching profiles:', error);
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
        Description,
        name,
        email,
        location
    } = req.body;
    
    const newProfile = new Profile({
        user: userId, 
        profileImage,
        age,
        description: Description,
        name,
        email,
        location
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

// Update profile
router.put('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const updateData = req.body;
    
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true, upsert: true }
        );
        
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:userId/compatibility', async (req, res) => {
  try {
    console.log('Profiles: Getting compatibility for user:', req.params.userId);
    
    // First check if user has tags
    const Tag = require('../models/Tag');
    const userTags = await Tag.findOne({ user: req.params.userId });
    
    if (!userTags) {
      console.log('Profiles: User has no tags, returning empty array');
      return res.json([]);
    }
    
    const sortedUsers = await getCompatibleUsers(req.params.userId);
    console.log('Profiles: Found', sortedUsers.length, 'compatible users');
    res.json(sortedUsers); // returns array of { userId, compatibility }
  } catch (err) {
    console.error('Error in compatibility endpoint:', err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
