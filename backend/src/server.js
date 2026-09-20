import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import apiRouter from './routes/index.js';
import authRoutes from './routes/auth.routes.js';
import providerRoutes from './routes/provider.routes.js';
import reviewRoutes from './routes/review.routes.js';
import productRoutes from './routes/product.routes.js';
import messageRoutes from './routes/message.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import prisma from './config/db.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows frontend to display local uploaded images
  })
);

// Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, can restrict in production
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// HTTP request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images statically (zero external 3rd-party software required)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'FixLink Backend API is operational',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Mount modular API router under /api
app.use('/api', apiRouter);

// Direct top-level routes for full specification compatibility
app.use('/auth', authRoutes);
app.post('/register', (req, res, next) => {
  req.url = '/register';
  authRoutes(req, res, next);
});
app.post('/login', (req, res, next) => {
  req.url = '/login';
  authRoutes(req, res, next);
});
app.use('/providers', providerRoutes);
app.use('/reviews', reviewRoutes);
app.use('/products', productRoutes);
app.use('/messages', messageRoutes);

// 404 handler for unknown routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 FixLink Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
const handleExit = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('PostgreSQL Prisma connection closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleExit('SIGINT'));
process.on('SIGTERM', () => handleExit('SIGTERM'));

export default app;
