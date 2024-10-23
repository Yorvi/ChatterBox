// backend/src/routes/authRoutes.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  (req, res, next) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.register
);

module.exports = router;
