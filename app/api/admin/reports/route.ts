import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getAllReports, updateReportStatus } from "@/lib/services/reportService";
import { ReportStatus } from "@/types";

export async function GET() {
  try {
    await requireAdmin();
    const reports = await getAllReports();
    return NextResponse.json({ reports });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { reportId, status } = body;

    if (!reportId || !["PENDING", "RESOLVED", "DISMISSED"].includes(status)) {
      return NextResponse.json({ error: "Invalid report ID or status" }, { status: 400 });
    }

    await updateReportStatus(reportId, status as ReportStatus);
    return NextResponse.json({ success: true, message: `Report status updated to ${status}` });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}
