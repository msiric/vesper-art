import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import {
  postComment,
  patchComment,
  deleteComment,
} from '../../../controllers/comment.js';

const router = express.Router();

router.route('/artwork/:artworkId/comment').post(
  [
    handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
    handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  ],
  handler(postComment, true, (req, res, next) => ({
    artworkId: req.params.artworkId,
  }))
);

router.route('/artwork/:artworkId/comment/:commentId').patch(
  [
    handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
    handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  ],
  handler(patchComment, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    commentId: req.params.commentId,
    commentContent: req.body.commentContent,
  }))
);

router.route('/artwork/:artworkId/comment/:commentId').delete(
  [
    handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
    handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  ],
  handler(deleteComment, true, (req, res, next) => ({
    artworkId: req.params.artworkId,
    commentId: req.params.commentId,
  }))
);

export default router;
