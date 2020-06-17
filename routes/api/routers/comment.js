import express from 'express';
import {
  isAuthenticated,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import comment from '../../../controllers/comment.js';

const router = express.Router();

router.route('/artwork/:artworkId/comment').post(
  isAuthenticated,
  handler(comment.postComment, true, (req, res, next) => ({
    artworkId: req.params.artworkId,
  }))
);

router.route('/artwork/:artworkId/comment/:commentId').patch(
  isAuthenticated,
  handler(comment.patchComment, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    commentId: req.params.commentId,
    commentContent: req.body.commentContent,
  }))
);

router.route('/artwork/:artworkId/comment/:commentId').delete(
  isAuthenticated,
  handler(comment.deleteComment, true, (req, res, next) => ({
    artworkId: req.params.artworkId,
    commentId: req.params.commentId,
  }))
);

export default router;
