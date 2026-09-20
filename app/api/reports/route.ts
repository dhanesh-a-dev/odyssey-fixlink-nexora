import { NextResponse } from "next/server";
import { createReport } from "@/lib/services/reportService";
import { getCurrentUser } from "@/lib/auth/session";
import { validateReport } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Please log in to report content." }, { status: 401 });
    }

    const body = await req.json();
    const { valid, errors } = validateReport(body);
    if (!valid) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const report = await createReport(session.userId, {
      targetType: body.targetType,
      targetId: body.targetId,
      reason: body.reason,
    });

    return NextResponse.json({ report, success: true }, { status: 201 });
  } catch (error) {
    console.error("Report creation error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
