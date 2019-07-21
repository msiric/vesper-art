const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const ChatController = require('../../controllers/chatController');
const User = require('../../models/user');
const crypto = require('crypto');
const async = require('async');

// View messages to and from authenticated user
router.get('/chat', isLoggedIn, ChatController.getConversations);

// Retrieve single conversation
router.get('/chat/:conversationId', isLoggedIn, ChatController.getConversation);

// Send reply in conversation
router.post('/chat/:conversationId', isLoggedIn, ChatController.sendReply);

// Start new conversation
router.post('/chat/new/:recipient', isLoggedIn, ChatController.newConversation);

module.exports = router;
