const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const commentController = require('../../../controllers/commentController');

router
  .route('/artwork/:artworkId/comment')
  .post(isAuthenticated, commentController.postComment);

router
  .route('/artwork/:artworkId/comment/:commentId')
  .patch(isAuthenticated, commentController.patchComment);

router
  .route('/artwork/:artworkId/comment/:commentId')
  .delete(isAuthenticated, commentController.deleteComment);

module.exports = router;
