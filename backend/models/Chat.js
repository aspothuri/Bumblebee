const mongoose = require('mongoose');

const chat = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [
        {
            type: [mongoose.Schema.Types.Mixed], 
            required: true
        }
    ]
});

const Chat = mongoose.model('Chat', chat);

module.exports = Chat;