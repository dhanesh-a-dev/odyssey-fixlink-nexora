import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getUserBookings,
  createBookingRequest,
  updateBookingStatus,
} from "@/lib/services/bookingService";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const bookings = await getUserBookings(session.userId);
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { providerId, serviceType, preferredDate, location, estimatedBudget, notes } = body;

    if (!providerId || !serviceType || !preferredDate || !notes) {
      return NextResponse.json(
        { error: "Missing required booking details (provider, service, date, notes)" },
        { status: 400 }
      );
    }

    if (providerId === session.userId) {
      return NextResponse.json(
        { error: "You cannot book your own service profile" },
        { status: 400 }
      );
    }

    const booking = await createBookingRequest({
      customerId: session.userId,
      providerId,
      serviceType,
      preferredDate,
      location: location || "Local Neighborhood",
      estimatedBudget: estimatedBudget ? Number(estimatedBudget) : undefined,
      notes,
    });

    return NextResponse.json({ booking, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking request" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing booking ID or status" }, { status: 400 });
    }

    const updated = await updateBookingStatus(bookingId, status, session.userId);
    return NextResponse.json({ booking: updated, success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
