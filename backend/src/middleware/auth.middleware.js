import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { sanitizeUser } from '../utils/helpers.js';

/**
 * Middleware to authenticate requests via JWT Bearer token.
 * Extracts token, verifies validity, and attaches authenticated user to req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'fixlink_default_dev_secret_key_123';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please log in again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or malformed authentication token.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        providerProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    // Attach sanitized user to request object (no password exposed)
    req.user = sanitizeUser(user);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict route access to specific roles.
 * Example: authorize('PROVIDER') or authorize('CUSTOMER', 'PROVIDER')
 * @param  {...string} roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${roles.join(' or ')} only.`,
      });
    }

    next();
  };
};
