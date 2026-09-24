// backend/src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', authenticate, postController.createPost);

// @route   GET /api/posts
// @desc    Get all posts (paginated)
router.get('/', authenticate, postController.getAllPosts);

// @route   GET /api/posts/:id
// @desc    Get a single post with its comments/replies
router.get('/:id', authenticate, postController.getPostById);

// @route   DELETE /api/posts/:id
// @desc    Delete a post (author or admin)
router.delete('/:id', authenticate, postController.deletePost);

// @route   POST /api/posts/:id/like
// @desc    Like a post
router.post('/:id/like', authenticate, postController.likePost);

// @route   DELETE /api/posts/:id/like
// @desc    Unlike a post
router.delete('/:id/like', authenticate, postController.unlikePost);

module.exports = router;
