const mongoose = require('mongoose');

const user = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  email: {
    type: String,
    required: false,
    trim: true,
  },
  name: {
    type: String,
    required: false,
    trim: true,
  },
  location: {
    type: String,
    required: false,
    trim: true,
  },
  interests: [{
    type: String,
    trim: true,
  }],
  honey: {
    type: Number,
    default: 10,
  },
  currentColony: {
    type: String,
    default: 'honeycomb',
  },
  unlockedColonies: [{
    type: String,
    default: ['honeycomb'],
  }],
}, {
  timestamps: true
});

const User = mongoose.model('User', user);

module.exports = User;