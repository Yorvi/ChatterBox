// backend/src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
// ... other imports

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
// Error Handler Middleware
app.use(errorHandler);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
// ... other routes

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to ChatterBox Backend!');
});

module.exports = app;
