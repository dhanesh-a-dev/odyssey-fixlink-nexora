import prisma from '../config/db.js';
import { getFileUrl, safeParseJson, safeStringify } from '../utils/helpers.js';

/**
 * @desc    Create a new marketplace product listing
 * @route   POST /api/products
 * @access  Private (Authenticated User)
 */
export const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, location } = req.body;
    const sellerId = req.user.id;

    if (!title || !description || !price || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, price, category, and location are required.',
      });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number.',
      });
    }

    // Images uploaded via Multer / Cloudinary or local storage
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((f) => getFileUrl(f, 'products'));
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const product = await prisma.product.create({
      data: {
        sellerId,
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        category: category.trim(),
        location: location.trim(),
        images: safeStringify(images),
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product listed successfully.',
      data: {
        ...product,
        images: safeParseJson(product.images),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all marketplace products with filtering by category & location
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const { category, location, search } = req.query;

    const where = {};

    if (category) {
      where.category = { contains: category.trim() };
    }

    if (location) {
      where.location = { contains: location.trim() };
    }

    if (search) {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
        { category: { contains: search.trim() } },
        { location: { contains: search.trim() } },
      ];
    }

    const rawProducts = await prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const products = rawProducts.map((p) => ({
      ...p,
      images: safeParseJson(p.images),
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single marketplace product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...product,
        images: safeParseJson(product.images),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a marketplace product listing
 * @route   PUT /api/products/:id
 * @access  Private (Owner/Seller only)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, location } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Ownership check: only seller can update
    if (product.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own product listings.',
      });
    }

    let images = safeParseJson(product.images);
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => getFileUrl(f, 'products'));
      images = [...images, ...newImages];
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: title ? title.trim() : product.title,
        description: description ? description.trim() : product.description,
        price: price ? parseFloat(price) : product.price,
        category: category ? category.trim() : product.category,
        location: location ? location.trim() : product.location,
        images: safeStringify(images),
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: {
        ...updated,
        images: safeParseJson(updated.images),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a marketplace product listing
 * @route   DELETE /api/products/:id
 * @access  Private (Owner/Seller only)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Ownership check: only seller can delete
    if (product.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own product listings.',
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Product listing deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
