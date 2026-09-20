import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Hashes plain text password with bcrypt
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compares plain text password with bcrypt hash
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Signs a JWT token containing user identity and role
 * @param {object} payload - { id, email, role }
 * @returns {string}
 */
export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'fixlink_default_dev_secret_key_123';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Strips sensitive fields (e.g. password) from user object before returning to client.
 * Ensures that nothing sensitive or confidential is made public.
 * @param {object} user
 * @returns {object} sanitized user object
 */
export const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

/**
 * Extracts public URL from uploaded Multer file (works with both Cloudinary and local disk storage)
 * @param {object} file
 * @param {string} folder
 * @returns {string|null}
 */
export const getFileUrl = (file, folder = 'general') => {
  if (!file) return null;
  // If uploaded to Cloudinary, path is already https://...
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
    return file.path;
  }
  // Local storage relative public URL
  return `/uploads/${folder}/${file.filename}`;
};

/**
 * Safely parse JSON string into array/object or return default
 */
export const safeParseJson = (data, defaultVal = []) => {
  if (!data) return defaultVal;
  if (Array.isArray(data) || typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch (err) {
    return defaultVal;
  }
};

/**
 * Safely stringify value to JSON string
 */
export const safeStringify = (data, defaultVal = '[]') => {
  if (data === null || data === undefined) return defaultVal;
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data);
  } catch (err) {
    return defaultVal;
  }
};


