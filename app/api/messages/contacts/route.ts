import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getAllUsers } from "@/lib/services/userService";
import { getProviders } from "@/lib/services/providerService";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const [allUsers, providersData] = await Promise.all([
      getAllUsers(),
      getProviders({ limit: 50 }),
    ]);

    // Build contacts list excluding the current user
    const providerMap = new Map(providersData.providers.map((p) => [p.userId, p]));

    const contacts = allUsers
      .filter((u) => u.id !== session.userId)
      .map((u) => {
        const pro = providerMap.get(u.id);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          avatarUrl: u.avatarUrl,
          location: u.location,
          role: u.role,
          profession: pro?.profession || (u.role === "PROVIDER" ? "Skilled Professional" : "Community Member"),
          rating: pro?.averageRating || 5.0,
          isProvider: Boolean(pro || u.role === "PROVIDER"),
        };
      });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Error fetching messaging contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}
