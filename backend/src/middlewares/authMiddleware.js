// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const User = require('../models/User');
const logger = require('../utils/logger');

exports.authenticate = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email', 'role'],
    });

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    logger.error('Authentication error', { error });
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};
