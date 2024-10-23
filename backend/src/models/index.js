// backend/src/models/index.js
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const FriendRequest = require('./FriendRequest');
// ... other models

// Define associations here if not already defined in individual model files

module.exports = {
  User,
  Post,
  Comment,
  FriendRequest,
  // ... other models
};
