import { NextResponse } from "next/server";
import { submitReview, deleteReview } from "@/lib/services/reviewService";
import { getCurrentUser } from "@/lib/auth/session";
import { validateReview } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Please log in to submit a review." }, { status: 401 });
    }

    const body = await req.json();
    const { valid, errors } = validateReview(body);
    if (!valid) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const review = await submitReview(session.userId, {
      providerId: body.providerId,
      rating: body.rating,
      comment: body.comment,
    });

    return NextResponse.json({ review, success: true }, { status: 201 });
  } catch (error: any) {
    if (error?.message === "CANNOT_REVIEW_SELF") {
      return NextResponse.json(
        { error: "You cannot review your own provider profile." },
        { status: 400 }
      );
    }
    if (error?.message === "ALREADY_REVIEWED") {
      return NextResponse.json(
        { error: "You have already reviewed this service provider. Only one review is allowed per customer." },
        { status: 409 }
      );
    }
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");
    if (!reviewId) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    await deleteReview(reviewId, session.userId, session.role === "ADMIN");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Not authorized to delete this review" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
