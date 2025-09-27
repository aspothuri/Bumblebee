const mongoose = require('mongoose');

const colony = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
        trim: true,
        unique: true 
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ]
}, { 
    timestamps: true 
});

const Colony = mongoose.model('Colony', colony);

module.exports = Colony;