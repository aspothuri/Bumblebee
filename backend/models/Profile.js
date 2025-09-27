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
});

const Profile = mongoose.model('Profile', profile);

module.exports = Profile;