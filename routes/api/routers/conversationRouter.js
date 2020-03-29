const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const conversationController = require('../../../controllers/conversationController');

router.get(
  '/conversations',
  isAuthenticated,
  conversationController.getConversations
);

router.get(
  '/conversations/:conversationId',
  isAuthenticated,
  conversationController.getConversation
);

router.post(
  '/conversations/:conversationId',
  isAuthenticated,
  conversationController.sendReply
);

router.post(
  '/conversations/new/:recipient',
  isAuthenticated,
  conversationController.newConversation
);

module.exports = router;
