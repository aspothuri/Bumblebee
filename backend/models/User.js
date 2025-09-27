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
});

const User = mongoose.model('User', user);

module.exports = User;