import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getAllUsers, updateUserRole } from "@/lib/services/userService";
import { Role } from "@/types";

export async function GET() {
  try {
    await requireAdmin();
    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !["USER", "PROVIDER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid user ID or role" }, { status: 400 });
    }

    await updateUserRole(userId, role as Role);
    return NextResponse.json({ success: true, message: `User role updated to ${role}` });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
