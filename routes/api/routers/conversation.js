import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import conversation from '../../../controllers/conversation.js';

const router = express.Router();

router
  .route('/conversations')
  .get(isAuthenticated, conversation.getConversations);

router
  .route('/conversations/:userId')
  .get(isAuthenticated, conversation.getConversation)
  .post(isAuthenticated, conversation.sendReply);

router
  .route('/conversations/new/:userId')
  .post(isAuthenticated, conversation.newConversation);

export default router;
