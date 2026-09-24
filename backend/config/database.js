// config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,     // Database name
  process.env.DB_USER,     // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    // Managed MySQL hosts (PlanetScale, etc.) require TLS - set DB_SSL=true for those
    dialectOptions: process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {},
  }
);

module.exports = sequelize;
