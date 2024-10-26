// src/routes/userRoutes.js
const express = require('express');
const { registerUser, getAllUsers, deleteUser } = require('../controllers/userController');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Get all users
router.get('/', getAllUsers);

// Delete a user by ID
router.delete('/:id', deleteUser);

module.exports = router;
