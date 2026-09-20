import { NextResponse } from "next/server";
import { getConversationMessages, sendMessage } from "@/lib/services/messageService";
import { getCurrentUser } from "@/lib/auth/session";
import { validateMessage } from "@/lib/validation";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const messages = await getConversationMessages(id, session.userId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { valid, errors } = validateMessage({ content: body.content, conversationId: id });
    if (!valid) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const message = await sendMessage(id, session.userId, body.content);
    return NextResponse.json({ message, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
