import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadProductImages } from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with category and location filtering
 */
router.get('/', getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get product details by ID
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a product listing with images
 * @access  Private (Authenticated users)
 */
router.post('/', authenticate, uploadProductImages, createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product listing (Owner only)
 * @access  Private (Authenticated seller)
 */
router.put('/:id', authenticate, uploadProductImages, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product listing (Owner only)
 * @access  Private (Authenticated seller)
 */
router.delete('/:id', authenticate, deleteProduct);

export default router;
