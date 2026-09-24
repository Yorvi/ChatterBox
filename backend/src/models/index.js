// backend/src/models/index.js
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const FriendRequest = require('./FriendRequest');
const Message = require('./Message');
const Like = require('./Like');
const Report = require('./Report');

module.exports = {
  User,
  Post,
  Comment,
  FriendRequest,
  Message,
  Like,
  Report,
};
