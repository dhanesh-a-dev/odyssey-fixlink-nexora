import express from 'express';
import authRoutes from './auth.routes.js';
import providerRoutes from './provider.routes.js';
import reviewRoutes from './review.routes.js';
import productRoutes from './product.routes.js';
import messageRoutes from './message.routes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'FixLink API is running healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/providers', providerRoutes);
router.use('/reviews', reviewRoutes);
router.use('/products', productRoutes);
router.use('/messages', messageRoutes);

export default router;
