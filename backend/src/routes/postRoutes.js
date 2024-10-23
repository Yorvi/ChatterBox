// backend/src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', authenticate, postController.createPost);

// @route   GET /api/posts
// @desc    Get all posts
router.get('/', authenticate, postController.getAllPosts);

module.exports = router;
