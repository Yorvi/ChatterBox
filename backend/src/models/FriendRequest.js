// backend/src/models/FriendRequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const FriendRequest = sequelize.define(
  'FriendRequest',
  {
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    tableName: 'friend_requests',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['sender_id', 'receiver_id'] }],
  }
);

// Associations
FriendRequest.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
FriendRequest.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
User.hasMany(FriendRequest, { foreignKey: 'senderId', as: 'sentFriendRequests' });
User.hasMany(FriendRequest, { foreignKey: 'receiverId', as: 'receivedFriendRequests' });

module.exports = FriendRequest;
