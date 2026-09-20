import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadProfileImage } from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register user (Customer or Provider) with optional profile picture
 */
router.post('/register', uploadProfileImage, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login and receive JWT
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user info (Requires Bearer token)
 */
router.get('/me', authenticate, getMe);

export default router;
