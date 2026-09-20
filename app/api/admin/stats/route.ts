import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminStats } from "@/lib/services/reportService";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await getAdminStats();
    return NextResponse.json({ stats });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied: Administrator privileges required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to load admin stats" }, { status: 500 });
  }
}
