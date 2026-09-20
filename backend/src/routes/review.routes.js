import express from 'express';
import { createReview, getProviderReviews } from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Submit a review and rating for a service provider
 * @access  Private (Authenticated users)
 */
router.post('/', authenticate, createReview);

/**
 * @route   GET /api/reviews/provider/:id
 * @desc    Get all reviews for a provider
 */
router.get('/provider/:id', getProviderReviews);

export default router;
