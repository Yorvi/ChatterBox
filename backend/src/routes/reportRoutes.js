// backend/src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middlewares/authMiddleware');

// @route   POST /api/reports
// @desc    File a report against a post, comment, or user
router.post('/', authenticate, reportController.createReport);

module.exports = router;
