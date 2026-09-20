import prisma from '../config/db.js';

/**
 * @desc    Create a review for a service provider
 * @route   POST /api/reviews
 * @access  Private (Authenticated Customer)
 */
export const createReview = async (req, res, next) => {
  try {
    const { providerId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    if (!providerId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'providerId, rating (1-5), and comment are required.',
      });
    }

    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    // Prevent reviewing oneself
    if (reviewerId === providerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot write a review for yourself.',
      });
    }

    // Verify target provider exists
    const provider = await prisma.user.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found.',
      });
    }

    const review = await prisma.review.create({
      data: {
        providerId,
        reviewerId,
        rating: numericRating,
        comment: comment.trim(),
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews for a specific provider
 * @route   GET /api/providers/:id/reviews
 * @access  Public
 */
export const getProviderReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if id is a userId or a providerProfile id
    let targetUserId = id;
    const profile = await prisma.providerProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
    });

    if (profile) {
      targetUserId = profile.userId;
    }

    const reviews = await prisma.review.findMany({
      where: { providerId: targetUserId },
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
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
