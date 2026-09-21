import prisma from "@/lib/db/prisma";
import { memoryStore } from "./dataStore";
import { sendMessage, getOrCreateConversation } from "./messageService";

export interface BookingRequestType {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  providerId: string;
  providerName: string;
  serviceType: string;
  preferredDate: string;
  location: string;
  estimatedBudget?: number;
  notes: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED";
  createdAt: Date;
}

// In-memory bookings store
const globalBookingsStore = globalThis as unknown as {
  __fixlinkBookings?: BookingRequestType[];
};

if (!globalBookingsStore.__fixlinkBookings) {
  globalBookingsStore.__fixlinkBookings = [
    {
      id: "bkg-01",
      customerId: "usr-04",
      customerName: "David Kim",
      customerEmail: "david@example.com",
      providerId: "usr-01",
      providerName: "Marcus Vance",
      serviceType: "Electrician",
      preferredDate: "2026-09-25",
      location: "San Francisco, CA",
      estimatedBudget: 250,
      notes: "Need EV charger 240V dedicated circuit breaker installation in garage.",
      status: "PENDING",
      createdAt: new Date(),
    },
  ];
}

export const memoryBookings = globalBookingsStore.__fixlinkBookings;

export async function createBookingRequest(data: {
  customerId: string;
  providerId: string;
  serviceType: string;
  preferredDate: string;
  location: string;
  estimatedBudget?: number;
  notes: string;
}): Promise<BookingRequestType> {
  const customer = memoryStore.users.find((u) => u.id === data.customerId);
  const provider = memoryStore.users.find((u) => u.id === data.providerId);

  const newBooking: BookingRequestType = {
    id: `bkg-${Date.now()}`,
    customerId: data.customerId,
    customerName: customer?.name || "Customer",
    customerEmail: customer?.email || "",
    providerId: data.providerId,
    providerName: provider?.name || "Provider",
    serviceType: data.serviceType,
    preferredDate: data.preferredDate,
    location: data.location,
    estimatedBudget: data.estimatedBudget,
    notes: data.notes,
    status: "PENDING",
    createdAt: new Date(),
  };

  memoryBookings.unshift(newBooking);

  // Automatically start conversation and send booking notification message to provider
  try {
    const convId = await getOrCreateConversation(data.customerId, data.providerId);
    const notificationText = `📅 NEW BOOKING REQUEST:
Service: ${data.serviceType}
Date: ${data.preferredDate}
Location: ${data.location}
${data.estimatedBudget ? `Budget: $${data.estimatedBudget}` : ""}
Notes: ${data.notes}`;

    await sendMessage(convId, data.customerId, notificationText);
  } catch (err) {
    console.error("Auto-chat booking notification error:", err);
  }

  return newBooking;
}

export async function getUserBookings(userId: string): Promise<BookingRequestType[]> {
  return memoryBookings.filter(
    (b) => b.customerId === userId || b.providerId === userId
  );
}

export async function updateBookingStatus(
  bookingId: string,
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED",
  userId: string
): Promise<BookingRequestType | null> {
  const booking = memoryBookings.find((b) => b.id === bookingId);
  if (!booking) return null;

  if (booking.providerId !== userId && booking.customerId !== userId) {
    throw new Error("UNAUTHORIZED");
  }

  booking.status = status;
  return booking;
}
