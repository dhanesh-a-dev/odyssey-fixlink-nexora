import express from 'express';
import {
  getProviders,
  getProviderById,
  createProviderProfile,
  updateProviderProfile,
} from '../controllers/provider.controller.js';
import { getProviderReviews } from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { uploadPortfolioImages } from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/providers
 * @desc    Search and filter providers by profession and location
 */
router.get('/', getProviders);

/**
 * @route   POST /api/providers/profile
 * @desc    Create provider professional profile with portfolio images
 * @access  Private (Provider only)
 */
router.post(
  '/profile',
  authenticate,
  authorize('PROVIDER'),
  uploadPortfolioImages,
  createProviderProfile
);

/**
 * @route   PUT /api/providers/profile
 * @desc    Update provider professional profile with portfolio images
 * @access  Private (Provider only)
 */
router.put(
  '/profile',
  authenticate,
  authorize('PROVIDER'),
  uploadPortfolioImages,
  updateProviderProfile
);

/**
 * @route   GET /api/providers/:id/reviews
 * @desc    Get all reviews for a provider
 */
router.get('/:id/reviews', getProviderReviews);

/**
 * @route   GET /api/providers/:id
 * @desc    Get provider profile details by ID
 */
router.get('/:id', getProviderById);

export default router;
