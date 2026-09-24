// backend/src/routes/friendRequestRoutes.js
const express = require('express');
const router = express.Router();
const friendRequestController = require('../controllers/friendRequestController');
const { authenticate } = require('../middlewares/authMiddleware');

// @route   POST /api/friend-requests
// @desc    Send a friend request
router.post('/', authenticate, friendRequestController.sendRequest);

// @route   GET /api/friend-requests/pending
// @desc    List pending requests addressed to the current user
router.get('/pending', authenticate, friendRequestController.listPending);

// @route   GET /api/friend-requests/friends
// @desc    List the current user's accepted friends
router.get('/friends', authenticate, friendRequestController.listFriends);

// @route   PUT /api/friend-requests/:id
// @desc    Accept or reject a friend request
router.put('/:id', authenticate, friendRequestController.respondToRequest);

module.exports = router;
