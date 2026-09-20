import prisma from "@/lib/db/prisma";
import { memoryStore } from "./dataStore";
import { ReviewType } from "@/types";

export async function getProviderReviews(providerId: string): Promise<ReviewType[]> {
  try {
    const list = await prisma.review.findMany({
      where: { providerId },
      include: { reviewer: true },
      orderBy: { createdAt: "desc" },
    });
    if (list.length > 0) {
      return list.map((r) => ({
        id: r.id,
        providerId: r.providerId,
        reviewerId: r.reviewerId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        reviewer: {
          id: r.reviewer.id,
          name: r.reviewer.name,
          avatarUrl: r.reviewer.avatarUrl,
        },
      }));
    }
  } catch {
    // Database query failed
  }

  return memoryStore.reviews
    .filter((r) => r.providerId === providerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((r) => {
      const user = memoryStore.users.find((u) => u.id === r.reviewerId);
      return {
        id: r.id,
        providerId: r.providerId,
        reviewerId: r.reviewerId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        reviewer: user
          ? {
              id: user.id,
              name: user.name,
              avatarUrl: user.avatarUrl,
            }
          : undefined,
      };
    });
}

export async function submitReview(
  reviewerId: string,
  data: { providerId: string; rating: number; comment: string }
): Promise<ReviewType> {
  // 1. Prevent self-review
  if (reviewerId === data.providerId) {
    throw new Error("CANNOT_REVIEW_SELF");
  }

  // 2. Prevent duplicate review
  try {
    const existing = await prisma.review.findUnique({
      where: {
        providerId_reviewerId: {
          providerId: data.providerId,
          reviewerId,
        },
      },
    });
    if (existing) {
      throw new Error("ALREADY_REVIEWED");
    }

    const created = await prisma.review.create({
      data: {
        providerId: data.providerId,
        reviewerId,
        rating: Math.min(5, Math.max(1, Math.round(data.rating))),
        comment: data.comment.trim(),
      },
      include: { reviewer: true },
    });

    return {
      id: created.id,
      providerId: created.providerId,
      reviewerId: created.reviewerId,
      rating: created.rating,
      comment: created.comment,
      createdAt: created.createdAt,
      reviewer: {
        id: created.reviewer.id,
        name: created.reviewer.name,
        avatarUrl: created.reviewer.avatarUrl,
      },
    };
  } catch (err: unknown) {
    if (err instanceof Error && (err.message === "CANNOT_REVIEW_SELF" || err.message === "ALREADY_REVIEWED")) {
      throw err;
    }
    // Database query failed, check memoryStore
  }

  // Memory store check
  const memExisting = memoryStore.reviews.find(
    (r) => r.providerId === data.providerId && r.reviewerId === reviewerId
  );
  if (memExisting) {
    throw new Error("ALREADY_REVIEWED");
  }

  const now = new Date();
  const id = `rev-${Date.now()}`;
  const newReview = {
    id,
    providerId: data.providerId,
    reviewerId,
    rating: Math.min(5, Math.max(1, Math.round(data.rating))),
    comment: data.comment.trim(),
    createdAt: now,
  };

  memoryStore.reviews.unshift(newReview);
  const user = memoryStore.users.find((u) => u.id === reviewerId);

  return {
    id: newReview.id,
    providerId: newReview.providerId,
    reviewerId: newReview.reviewerId,
    rating: newReview.rating,
    comment: newReview.comment,
    createdAt: newReview.createdAt,
    reviewer: user
      ? {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        }
      : undefined,
  };
}

export async function deleteReview(reviewId: string, userId: string, isAdmin: boolean = false) {
  try {
    const rev = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!rev) throw new Error("NOT_FOUND");
    if (rev.reviewerId !== userId && !isAdmin) throw new Error("FORBIDDEN");

    await prisma.review.delete({ where: { id: reviewId } });
    return true;
  } catch {
    const idx = memoryStore.reviews.findIndex((r) => r.id === reviewId);
    if (idx === -1) throw new Error("NOT_FOUND");
    if (memoryStore.reviews[idx].reviewerId !== userId && !isAdmin) {
      throw new Error("FORBIDDEN");
    }
    memoryStore.reviews.splice(idx, 1);
    return true;
  }
}
