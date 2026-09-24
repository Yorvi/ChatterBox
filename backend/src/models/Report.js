// backend/src/models/Report.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const Report = sequelize.define(
  'Report',
  {
    targetType: {
      type: DataTypes.ENUM('post', 'comment', 'user'),
      allowNull: false,
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'resolved', 'dismissed'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    tableName: 'reports',
    timestamps: true,
    underscored: true,
  }
);

// Associations
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
User.hasMany(Report, { foreignKey: 'reporterId', as: 'reports' });

module.exports = Report;
