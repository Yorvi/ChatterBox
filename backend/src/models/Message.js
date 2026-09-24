// backend/src/models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const Message = sequelize.define(
  'Message',
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'messages',
    timestamps: true,
    underscored: true,
  }
);

// Associations
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });

module.exports = Message;
