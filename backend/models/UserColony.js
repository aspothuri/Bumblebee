const mongoose = require('mongoose');

const userColony = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
        unique: true
    },

    currentColony: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Colony',
        required: false, 
        default: null
    },


    previousColonies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Colony',
            required: true
        }
    ]
}, { 
    timestamps: true 
});

const UserColony = mongoose.model('UserColony', userColony);

module.exports = UserColony;