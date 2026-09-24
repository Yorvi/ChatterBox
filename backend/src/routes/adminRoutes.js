// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Every route below requires an authenticated admin
router.use(authenticate, authorize('admin'));

// @route   GET /api/admin/reports
// @desc    Get all reports
router.get('/reports', adminController.getReports);

// @route   PUT /api/admin/reports/:id
// @desc    Mark a report as resolved or dismissed
router.put('/reports/:id', adminController.resolveReport);

// @route   DELETE /api/admin/posts/:id
router.delete('/posts/:id', adminController.deletePost);

// @route   DELETE /api/admin/comments/:id
router.delete('/comments/:id', adminController.deleteComment);

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
