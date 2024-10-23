// backend/src/routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middlewares/authMiddleware');

// @route   POST /api/comments
// @desc    Create a new comment
router.post('/', authenticate, commentController.createComment);

module.exports = router;
