const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const conversationController = require('../../../controllers/conversationController');

router
  .route('/conversations')
  .get(isAuthenticated, conversationController.getConversations);

router
  .route('/conversations/:userId')
  .get(isAuthenticated, conversationController.getConversation)
  .post(isAuthenticated, conversationController.sendReply);

router
  .route('/conversations/new/:userId')
  .post(isAuthenticated, conversationController.newConversation);

module.exports = router;
