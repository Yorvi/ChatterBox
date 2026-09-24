// backend/src/models/Like.js
const sequelize = require('../../config/database');
const User = require('./User');
const Post = require('./Post');

const Like = sequelize.define(
  'Like',
  {},
  {
    tableName: 'likes',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['user_id', 'post_id'] }],
  }
);

// Associations
Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Post, { foreignKey: 'postId' });
User.hasMany(Like, { foreignKey: 'userId' });
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });

module.exports = Like;
