// backend/src/models/FriendRequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const FriendRequest = sequelize.define('FriendRequest', {
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // Other values: 'accepted', 'rejected'
  },
});

// Associations
FriendRequest.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
FriendRequest.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

module.exports = FriendRequest;
