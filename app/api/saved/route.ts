import { NextResponse } from "next/server";
import { getUserSavedItems, toggleSaveProvider, toggleSaveProduct } from "@/lib/services/savedService";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const data = await getUserSavedItems(session.userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching saved items:", error);
    return NextResponse.json({ error: "Failed to fetch saved items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { type, id } = body; // type: "PROVIDER" | "PRODUCT", id: string

    if (!type || !id) {
      return NextResponse.json({ error: "Type and ID are required" }, { status: 400 });
    }

    if (type === "PROVIDER") {
      const result = await toggleSaveProvider(session.userId, id);
      return NextResponse.json(result);
    } else if (type === "PRODUCT") {
      const result = await toggleSaveProduct(session.userId, id);
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error toggling save:", error);
    return NextResponse.json({ error: "Failed to update saved status" }, { status: 500 });
  }
}
