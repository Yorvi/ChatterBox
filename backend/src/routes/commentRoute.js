// backend/src/routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middlewares/authMiddleware');

// @route   POST /api/comments
// @desc    Create a new comment
router.post('/', authenticate, commentController.createComment);

// @route   DELETE /api/comments/:id
// @desc    Delete a comment (author or admin)
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
