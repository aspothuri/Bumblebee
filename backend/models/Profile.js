const mongoose = require('mongoose');

const profile = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
    default: 'https://placehold.co/400x400',
  },
  age: {
    type: Number,
    min: 18,
    max: 50,
    default: 18
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters.'],
  },
  name: {
    type: String,
    trim: true,
    required: false,
  },
  email: {
    type: String,
    trim: true,
    required: false,
  },
  location: {
    type: String,
    trim: true,
    required: false,
  },
  occupation: {
    type: String,
    trim: true,
    default: 'Professional',
  },
  education: {
    type: String,
    trim: true,
    default: 'University',
  },
  height: {
    type: String,
    trim: true,
    default: '5\'10"',
  },
  photos: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profile);

module.exports = Profile;