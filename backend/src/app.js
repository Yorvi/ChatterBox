// app.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const sequelize = require('../config/database');
require('./models'); // load every model + association before anything queries the DB

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoute');
const friendRequestRoutes = require('./routes/friendRequestRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(morgan('dev'));
app.use(express.json()); // Parse incoming JSON requests

// Uploaded files (profile photos, cover photos, post media) - local disk for
// now; swap for S3/Cloudinary in production without changing the API contract
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Used by the hosting platform's health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/friend-requests', friendRequestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

// Sync Database
sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.error('Error connecting to the database:', err));

sequelize
  .sync({ force: false }) // Don't force in production
  .catch((err) => console.error('Error syncing database schema:', err));

// Must be registered last so it catches errors from every route above
app.use(errorHandler);

module.exports = app;
