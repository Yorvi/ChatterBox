// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// @route   GET /api/admin/reports
// @desc    Get all reports
router.get('/reports', authenticate, authorize('admin'), adminController.getReports);

module.exports = router;
