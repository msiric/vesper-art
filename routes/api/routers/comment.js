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
  [isAuthenticated, checkParamsId],
  handler(postComment, true, (req, res, next) => ({
    ...req.params,
  }))
);

router.route('/artwork/:artworkId/comment/:commentId').patch(
  [isAuthenticated, checkParamsId],
  handler(patchComment, false, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route('/artwork/:artworkId/comment/:commentId').delete(
  [isAuthenticated, checkParamsId],
  handler(deleteComment, true, (req, res, next) => ({
    ...req.params,
  }))
);

export default router;
