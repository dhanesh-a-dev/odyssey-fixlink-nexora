import multer from 'multer';
import { profileStorage, portfolioStorage, productStorage } from '../config/cloudinary.js';

// File filter to accept images only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB limit per file
};

// 1. Profile image upload (Single file)
export const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter,
  limits,
}).single('profileImage');

// 2. Provider portfolio images (Up to 5 images)
export const uploadPortfolioImages = multer({
  storage: portfolioStorage,
  fileFilter,
  limits,
}).array('portfolioImages', 5);

// 3. Marketplace product images (Up to 5 images)
export const uploadProductImages = multer({
  storage: productStorage,
  fileFilter,
  limits,
}).array('images', 5);
