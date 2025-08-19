const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150x150/2d3748/e2e8f0?text=User',
    },
    googleId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
