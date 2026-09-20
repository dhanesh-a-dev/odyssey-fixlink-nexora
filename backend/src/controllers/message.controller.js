import prisma from '../config/db.js';

/**
 * @desc    Send a direct message
 * @route   POST /api/messages
 * @access  Private (Authenticated User)
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'receiverId and content are required.',
      });
    }

    if (receiverId === senderId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a message to yourself.',
      });
    }

    // Check receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true },
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found.',
      });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully.',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get conversation history between current user and target user
 * @route   GET /api/messages/:userId
 * @access  Private (Authenticated User)
 */
export const getConversation = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    // Fetch two-way conversation
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: currentUserId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all conversations (inbox summary) for current user
 * @route   GET /api/messages
 * @access  Private (Authenticated User)
 */
export const getConversationsList = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    // Find all messages involving current user
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      include: {
        sender: {
          select: { id: true, name: true, profileImage: true },
        },
        receiver: {
          select: { id: true, name: true, profileImage: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group messages by conversational partner
    const conversationsMap = new Map();

    for (const msg of messages) {
      const partner = msg.senderId === currentUserId ? msg.receiver : msg.sender;
      if (!conversationsMap.has(partner.id)) {
        conversationsMap.set(partner.id, {
          contact: partner,
          lastMessage: {
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            createdAt: msg.createdAt,
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      data: Array.from(conversationsMap.values()),
    });
  } catch (error) {
    next(error);
  }
};
