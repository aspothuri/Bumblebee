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
    default: '',
    trim: true,
  },
  age: {
    type: Number,
    min: 18,
    max: 100,
    default: 18
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters.'],
    default: '',
  },
  name: {
    type: String,
    trim: true,
    required: false,
    default: '',
  },
  email: {
    type: String,
    trim: true,
    required: false,
    default: '',
  },
  location: {
    type: String,
    trim: true,
    required: false,
    default: '',
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

// Add index for faster queries
profile.index({ user: 1 });

const Profile = mongoose.model('Profile', profile);

module.exports = Profile;