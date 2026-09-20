import prisma from '../config/db.js';
import { getFileUrl, safeParseJson, safeStringify } from '../utils/helpers.js';

/**
 * @desc    Get all service providers with filtering by profession & location
 * @route   GET /api/providers
 * @access  Public
 */
export const getProviders = async (req, res, next) => {
  try {
    const { profession, location, search } = req.query;

    const where = {};

    if (profession) {
      where.profession = { contains: profession.trim() };
    }

    if (location) {
      where.location = { contains: location.trim() };
    }

    if (search) {
      where.OR = [
        { profession: { contains: search.trim() } },
        { location: { contains: search.trim() } },
        { bio: { contains: search.trim() } },
        { user: { name: { contains: search.trim() } } },
      ];
    }

    const profiles = await prisma.providerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            createdAt: true,
            reviewsReceived: {
              select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Compute average rating & review count for each provider
    const providers = profiles.map((p) => {
      const reviews = p.user.reviewsReceived || [];
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
          : 0;

      return {
        id: p.id,
        userId: p.userId,
        name: p.user.name,
        email: p.user.email,
        profileImage: p.user.profileImage,
        profession: p.profession,
        bio: p.bio,
        experienceYears: p.experienceYears,
        location: p.location,
        skills: safeParseJson(p.skills),
        portfolioImages: safeParseJson(p.portfolioImages),
        averageRating,
        totalReviews,
        createdAt: p.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get provider profile by ID (userId or profileId)
 * @route   GET /api/providers/:id
 * @access  Public
 */
export const getProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Search by userId or providerProfile id
    const profile = await prisma.providerProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            createdAt: true,
            reviewsReceived: {
              include: {
                reviewer: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found.',
      });
    }

    const reviews = profile.user.reviewsReceived || [];
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      data: {
        id: profile.id,
        userId: profile.userId,
        name: profile.user.name,
        email: profile.user.email,
        profileImage: profile.user.profileImage,
        profession: profile.profession,
        bio: profile.bio,
        experienceYears: profile.experienceYears,
        location: profile.location,
        skills: safeParseJson(profile.skills),
        portfolioImages: safeParseJson(profile.portfolioImages),
        averageRating,
        totalReviews,
        reviews,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create provider profile
 * @route   POST /api/providers/profile
 * @access  Private (Provider only)
 */
export const createProviderProfile = async (req, res, next) => {
  try {
    const { profession, bio, experienceYears, location, skills } = req.body;

    if (!profession || !location) {
      return res.status(400).json({
        success: false,
        message: 'Profession and location are required.',
      });
    }

    // Check if provider profile already exists for this user
    const existing = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists. Use PUT /api/providers/profile to update.',
      });
    }

    // Parse skills array if sent as comma-separated string or array
    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (typeof skills === 'string') {
      parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    // Portfolio images uploaded via Multer/Cloudinary or local storage
    const portfolioImages = req.files ? req.files.map((file) => getFileUrl(file, 'portfolio')) : [];

    const profile = await prisma.providerProfile.create({
      data: {
        userId: req.user.id,
        profession,
        bio: bio || '',
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : 0,
        location,
        skills: safeStringify(parsedSkills),
        portfolioImages: safeStringify(portfolioImages),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Provider profile created successfully.',
      data: {
        ...profile,
        skills: safeParseJson(profile.skills),
        portfolioImages: safeParseJson(profile.portfolioImages),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update provider profile
 * @route   PUT /api/providers/profile
 * @access  Private (Provider only)
 */
export const updateProviderProfile = async (req, res, next) => {
  try {
    const { profession, bio, experienceYears, location, skills } = req.body;

    const existing = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile does not exist. Create one first.',
      });
    }

    // Parse skills if provided
    let parsedSkills = safeParseJson(existing.skills);
    if (skills) {
      if (Array.isArray(skills)) {
        parsedSkills = skills;
      } else if (typeof skills === 'string') {
        parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    // Append newly uploaded images to existing portfolio
    let portfolioImages = safeParseJson(existing.portfolioImages);
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => getFileUrl(file, 'portfolio'));
      portfolioImages = [...portfolioImages, ...newImages];
    }

    const updated = await prisma.providerProfile.update({
      where: { userId: req.user.id },
      data: {
        profession: profession ?? existing.profession,
        bio: bio ?? existing.bio,
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : existing.experienceYears,
        location: location ?? existing.location,
        skills: safeStringify(parsedSkills),
        portfolioImages: safeStringify(portfolioImages),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Provider profile updated successfully.',
      data: {
        ...updated,
        skills: safeParseJson(updated.skills),
        portfolioImages: safeParseJson(updated.portfolioImages),
      },
    });
  } catch (error) {
    next(error);
  }
};
