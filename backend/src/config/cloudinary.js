import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables (if provided)
const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

import multer from 'multer';
import fs from 'fs';
import path from 'path';

const createDiskStorage = (folderName) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads', folderName);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
};

// Storage for User Profile Avatars
export const profileStorage = hasCloudinary
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'fixlink/profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }],
      },
    })
  : createDiskStorage('profiles');

// Storage for Provider Portfolio Images
export const portfolioStorage = hasCloudinary
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'fixlink/portfolio',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
      },
    })
  : createDiskStorage('portfolio');

// Storage for Marketplace Product Images
export const productStorage = hasCloudinary
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'fixlink/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
      },
    })
  : createDiskStorage('products');

export default cloudinary;
