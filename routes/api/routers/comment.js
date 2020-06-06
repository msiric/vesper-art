import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import comment from '../../../controllers/comment.js';

const router = express.Router();

router
  .route('/artwork/:artworkId/comment')
  .post(isAuthenticated, comment.postComment);

router
  .route('/artwork/:artworkId/comment/:commentId')
  .patch(isAuthenticated, comment.patchComment);

router
  .route('/artwork/:artworkId/comment/:commentId')
  .delete(isAuthenticated, comment.deleteComment);

export default router;
