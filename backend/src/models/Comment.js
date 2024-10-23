// backend/src/models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');
const Post = require('./Post');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Associations
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });

Comment.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });

// For nested comments (replies)
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });

module.exports = Comment;
