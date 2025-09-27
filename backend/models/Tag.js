const mongoose = require('mongoose');

const tag = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    adventure: { type: Number, min: 1, max: 10, default: 1 },
    creativity: { type: Number, min: 1, max: 10, default: 1 },
    fitness: { type: Number, min: 1, max: 10, default: 1 },
    technology: { type: Number, min: 1, max: 10, default: 1 },
    foodCooking: { type: Number, min: 1, max: 10, default: 1 },
    reading: { type: Number, min: 1, max: 10, default: 1 },
    moviesTV: { type: Number, min: 1, max: 10, default: 1 },
    music: { type: Number, min: 1, max: 10, default: 1 },
    travel: { type: Number, min: 1, max: 10, default: 1 },
    socializing: { type: Number, min: 1, max: 10, default: 1 },
    quietNightsIn: { type: Number, min: 1, max: 10, default: 1 },
    hiking: { type: Number, min: 1, max: 10, default: 1 },
    gaming: { type: Number, min: 1, max: 10, default: 1 },
    sports: { type: Number, min: 1, max: 10, default: 1 },
    comedy: { type: Number, min: 1, max: 10, default: 1 },
    artMuseums: { type: Number, min: 1, max: 10, default: 1 },
    politics: { type: Number, min: 1, max: 10, default: 1 },
    science: { type: Number, min: 1, max: 10, default: 1 },
    spirituality: { type: Number, min: 1, max: 10, default: 1 },
    pets: { type: Number, min: 1, max: 10, default: 1 },
    fashion: { type: Number, min: 1, max: 10, default: 1 },
    diyCrafts: { type: Number, min: 1, max: 10, default: 1 },
    volunteering: { type: Number, min: 1, max: 10, default: 1 },
    boardGames: { type: Number, min: 1, max: 10, default: 1 },
    history: { type: Number, min: 1, max: 10, default: 1 },
    sustainability: { type: Number, min: 1, max: 10, default: 1 },
    liveEvents: { type: Number, min: 1, max: 10, default: 1 },
    personalGrowth: { type: Number, min: 1, max: 10, default: 1 },
    photography: { type: Number, min: 1, max: 10, default: 1 },
    gardening: { type: Number, min: 1, max: 10, default: 1 },
});

const Tag = mongoose.model("Tag",tag);

module.exports = Tag;