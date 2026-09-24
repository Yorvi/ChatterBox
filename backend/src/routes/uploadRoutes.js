// backend/src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middlewares/authMiddleware');

// @route   POST /api/uploads
// @desc    Upload an image file (form field name "file"), returns { url }
router.post(
  '/',
  authenticate,
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadController.uploadFile
);

module.exports = router;
