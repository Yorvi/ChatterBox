// backend/src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 25], // Username length between 3 and 25 characters
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Validates format of email
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePhoto: {
    type: DataTypes.STRING, // URL to profile photo
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user', // Other possible value: 'admin'
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  appleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = User;
