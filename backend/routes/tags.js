const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

const ALL_TAG_FIELDS_STRING = 'user adventure creativity fitness technology foodCooking reading moviesTV music travel socializing quietNightsIn hiking gaming sports comedy artMuseums politics science spirituality pets fashion diyCrafts volunteering boardGames history sustainability liveEvents personalGrowth photography gardening';
const TAG_KEYS_ORDERED = ALL_TAG_FIELDS_STRING.split(' ').slice(1);

// get all tags
router.get('/', async (req, res) => {
    console.log('Received Query:', req.query);
    try {
        const tags = await Tag.find().select(ALL_TAG_FIELDS_STRING);

        const tagTuples = tags.map(tagDoc => {
            const userId = tagDoc.user ? tagDoc.user.toString() : 'UNKNOWN_USER'; 
            const tuple = [userId]; 
            
            for (const key of TAG_KEYS_ORDERED) {
                tuple.push(tagDoc[key] || 0); 
            }
            return tuple;
        });

        res.status(200).json(tagTuples);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// post new tags
router.post('/:userId', async (req, res) => {
    const userId = req.params.userId; 
    const {
    adventure,
    creativity,
    fitness,
    technology,
    foodCooking,
    reading,
    moviesTV,
    music,
    travel,
    socializing,
    quietNightsIn,
    hiking,
    gaming,
    sports,
    comedy,
    artMuseums,
    politics,
    science,
    spirituality,
    pets,
    fashion,
    diyCrafts,
    volunteering,
    boardGames,
    history,
    sustainability,
    liveEvents,
    personalGrowth,
    photography,
    gardening
} = req.body;
    
    const newTagSet = new Tag({
        user: userId, 
        adventure,
        creativity,
        fitness,
        technology,
        foodCooking,
        reading,
        moviesTV,
        music,
        travel,
        socializing,
        quietNightsIn,
        hiking,
        gaming,
        sports,
        comedy,
        artMuseums,
        politics,
        science,
        spirituality,
        pets,
        fashion,
        diyCrafts,
        volunteering,
        boardGames,
        history,
        sustainability,
        liveEvents,
        personalGrowth,
        photography,
        gardening
    });

    try {
        const savedTag = await newTagSet.save();
        res.status(201).json(savedTag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
