import { NextResponse } from "next/server";
import { getUserConversations, getOrCreateConversation } from "@/lib/services/messageService";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const conversations = await getUserConversations(session.userId);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { targetUserId } = body;
    if (!targetUserId) {
      return NextResponse.json({ error: "Target user ID required" }, { status: 400 });
    }

    if (targetUserId === session.userId) {
      return NextResponse.json({ error: "You cannot start a conversation with yourself." }, { status: 400 });
    }

    const conversationId = await getOrCreateConversation(session.userId, targetUserId);
    return NextResponse.json({ conversationId, success: true });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ error: "Failed to start conversation" }, { status: 500 });
  }
}
