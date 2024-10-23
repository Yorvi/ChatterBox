// backend/src/models/Post.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const Post = sequelize.define('Post', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mediaUrl: {
    type: DataTypes.STRING, // URL to media (image/video)
    allowNull: true,
  },
});

// Associations
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });

module.exports = Post;
