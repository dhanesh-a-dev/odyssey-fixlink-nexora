import express from 'express';
import {
  sendMessage,
  getConversation,
  getConversationsList,
} from '../controllers/message.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All messaging endpoints require authentication
router.use(authenticate);

/**
 * @route   GET /api/messages
 * @desc    Get inbox list of active conversations with last messages
 * @access  Private
 */
router.get('/', getConversationsList);

/**
 * @route   GET /api/messages/:userId
 * @desc    Get conversation chat history with a specific user
 * @access  Private
 */
router.get('/:userId', getConversation);

/**
 * @route   POST /api/messages
 * @desc    Send a message to a user
 * @access  Private
 */
router.post('/', sendMessage);

export default router;
