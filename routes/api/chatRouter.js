const router = require('express').Router();
const { isLoggedInAPI } = require('../../utils/helpers');
const ChatController = require('../../controllers/chatController');
const User = require('../../models/user');
const crypto = require('crypto');
const async = require('async');

// View messages to and from authenticated user
router.get('/chat', isLoggedInAPI, ChatController.getConversations);

// Retrieve single conversation
router.get(
  '/chat/:conversationId',
  isLoggedInAPI,
  ChatController.getConversation
);

// Send reply in conversation
router.post('/chat/:conversationId', isLoggedInAPI, ChatController.sendReply);

// Start new conversation
router.post(
  '/chat/new/:recipient',
  isLoggedInAPI,
  ChatController.newConversation
);

module.exports = router;
