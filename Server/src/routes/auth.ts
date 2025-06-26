import express from 'express';
import { check } from 'express-validator';
import { registerAdmin, login, getAllUsers } from '../controllers/authController';

const router = express.Router();

// @route   POST /api/auth/register-admin
// @desc    Register a new admin user
// @access  Public
router.post(
  '/register-admin',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  registerAdmin
);

// @route   POST /api/auth/login
// @desc    Authenticate user (simplified - no token)
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

// @route   GET /api/auth/users
// @desc    Get all users (simplified - no authentication required)
// @access  Public
router.get('/users', getAllUsers);

export default router;
