// src/routes/userRoutes.js
const express = require('express');
const { getAllUsers, getUserById, updateProfile, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Registration happens through /api/auth/register - see authRoutes.js

// Get all users
router.get('/', authenticate, getAllUsers);

// Get a single user's public profile
router.get('/:id', authenticate, getUserById);

// Update a user's profile (self or admin)
router.put('/:id', authenticate, updateProfile);

// Delete a user by ID (self or admin)
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
