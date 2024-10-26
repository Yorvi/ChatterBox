// app.js
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('../config/database');

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/users', userRoutes);

// Sync Database
sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.error('Error connecting to the database:', err));

sequelize.sync({ force: false }); // Don't force in production

module.exports = app;
