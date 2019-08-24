const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const conversationController = require('../../controllers/conversationController');

router.get(
  '/conversations',
  isLoggedIn,
  conversationController.getConversations
);

router.get(
  '/conversations/:conversationId',
  isLoggedIn,
  conversationController.getConversation
);

router.post(
  '/conversations/:conversationId',
  isLoggedIn,
  conversationController.sendReply
);

router.post(
  '/conversations/new/:recipient',
  isLoggedIn,
  conversationController.newConversation
);

module.exports = router;
