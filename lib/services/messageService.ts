import prisma from "@/lib/db/prisma";
import { memoryStore } from "./dataStore";
import { ConversationType, MessageType } from "@/types";

export async function getUserConversations(userId: string): Promise<ConversationType[]> {
  try {
    const dbConversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: { user: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (dbConversations.length > 0) {
      // Calculate unread count for each conversation
      const result: ConversationType[] = [];
      for (const conv of dbConversations) {
        const unread = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            readAt: null,
          },
        });

        const lastMsg = conv.messages[0];

        result.push({
          id: conv.id,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          unreadCount: unread,
          lastMessage: lastMsg
            ? {
                id: lastMsg.id,
                conversationId: lastMsg.conversationId,
                senderId: lastMsg.senderId,
                content: lastMsg.content,
                createdAt: lastMsg.createdAt,
                readAt: lastMsg.readAt,
              }
            : null,
          participants: conv.participants.map((p) => ({
            userId: p.userId,
            user: {
              id: p.user.id,
              name: p.user.name,
              email: p.user.email,
              avatarUrl: p.user.avatarUrl,
              phone: p.user.phone,
              location: p.user.location,
              latitude: p.user.latitude,
              longitude: p.user.longitude,
              role: p.user.role,
              createdAt: p.user.createdAt,
            },
          })),
        });
      }
      return result;
    }
  } catch {
    // Database query failed
  }

  // Memory store fallback
  const userConvs = memoryStore.conversations.filter((c) =>
    c.participantIds.includes(userId)
  );

  return userConvs
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((c) => {
      const messages = memoryStore.messages
        .filter((m) => m.conversationId === c.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const lastMsg = messages[0];
      const unreadCount = messages.filter(
        (m) => m.senderId !== userId && m.readAt === null
      ).length;

      const participants = c.participantIds.map((pid) => {
        const u = memoryStore.users.find((user) => user.id === pid);
        return {
          userId: pid,
          user: u
            ? {
                id: u.id,
                name: u.name,
                email: u.email,
                avatarUrl: u.avatarUrl,
                phone: u.phone,
                location: u.location,
                latitude: u.latitude,
                longitude: u.longitude,
                role: u.role,
                createdAt: u.createdAt,
              }
            : {
                id: pid,
                name: "User",
                email: "",
                avatarUrl: null,
                phone: null,
                location: "",
                latitude: null,
                longitude: null,
                role: "USER" as const,
                createdAt: new Date(),
              },
        };
      });

      return {
        id: c.id,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        unreadCount,
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              conversationId: lastMsg.conversationId,
              senderId: lastMsg.senderId,
              content: lastMsg.content,
              createdAt: lastMsg.createdAt,
              readAt: lastMsg.readAt,
            }
          : null,
        participants,
      };
    });
}

export async function getOrCreateConversation(
  userId: string,
  targetUserId: string
): Promise<string> {
  if (userId === targetUserId) {
    throw new Error("CANNOT_MESSAGE_SELF");
  }

  try {
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
    });

    if (existing) return existing.id;

    const created = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId }, { userId: targetUserId }],
        },
      },
    });
    return created.id;
  } catch {
    // Memory store fallback
  }

  const existingMem = memoryStore.conversations.find(
    (c) =>
      c.participantIds.includes(userId) && c.participantIds.includes(targetUserId)
  );
  if (existingMem) return existingMem.id;

  const newConv = {
    id: `conv-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    participantIds: [userId, targetUserId],
  };
  memoryStore.conversations.unshift(newConv);
  return newConv.id;
}

export async function getConversationMessages(
  conversationId: string,
  userId: string
): Promise<MessageType[]> {
  try {
    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: true },
      orderBy: { createdAt: "asc" },
    });

    if (messages.length > 0) {
      return messages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        content: m.content,
        createdAt: m.createdAt,
        readAt: m.readAt,
        sender: {
          id: m.sender.id,
          name: m.sender.name,
          avatarUrl: m.sender.avatarUrl,
        },
      }));
    }
  } catch {
    // Database query failed
  }

  // Memory store fallback
  const conv = memoryStore.conversations.find((c) => c.id === conversationId);
  if (!conv || !conv.participantIds.includes(userId)) {
    return [];
  }

  const now = new Date();
  memoryStore.messages.forEach((m) => {
    if (m.conversationId === conversationId && m.senderId !== userId && !m.readAt) {
      m.readAt = now;
    }
  });

  return memoryStore.messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((m) => {
      const sender = memoryStore.users.find((u) => u.id === m.senderId);
      return {
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        content: m.content,
        createdAt: m.createdAt,
        readAt: m.readAt,
        sender: sender
          ? {
              id: sender.id,
              name: sender.name,
              avatarUrl: sender.avatarUrl,
            }
          : undefined,
      };
    });
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<MessageType> {
  const cleanContent = content.trim();
  if (!cleanContent) throw new Error("EMPTY_MESSAGE");
  const now = new Date();

  try {
    const created = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: cleanContent,
      },
      include: { sender: true },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: now },
    });

    return {
      id: created.id,
      conversationId: created.conversationId,
      senderId: created.senderId,
      content: created.content,
      createdAt: created.createdAt,
      readAt: created.readAt,
      sender: {
        id: created.sender.id,
        name: created.sender.name,
        avatarUrl: created.sender.avatarUrl,
      },
    };
  } catch {
    // Memory store fallback
  }

  const conv = memoryStore.conversations.find((c) => c.id === conversationId);
  if (!conv) throw new Error("CONVERSATION_NOT_FOUND");

  conv.updatedAt = now;
  const newMsg = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId,
    content: cleanContent,
    createdAt: now,
    readAt: null,
  };
  memoryStore.messages.push(newMsg);

  const sender = memoryStore.users.find((u) => u.id === senderId);

  return {
    id: newMsg.id,
    conversationId: newMsg.conversationId,
    senderId: newMsg.senderId,
    content: newMsg.content,
    createdAt: newMsg.createdAt,
    readAt: newMsg.readAt,
    sender: sender
      ? {
          id: sender.id,
          name: sender.name,
          avatarUrl: sender.avatarUrl,
        }
      : undefined,
  };
}
