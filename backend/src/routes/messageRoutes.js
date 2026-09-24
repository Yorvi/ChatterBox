// backend/src/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middlewares/authMiddleware');

// @route   GET /api/messages
// @desc    List the current user's conversations
router.get('/', authenticate, messageController.getConversations);

// @route   GET /api/messages/:userId
// @desc    Get full message history with one other user
router.get('/:userId', authenticate, messageController.getConversation);

module.exports = router;
