const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const reviewController = require('../../../controllers/reviewController');

router
  .route('/rate_artwork/:orderId')
  .post(isAuthenticated, reviewController.postReview);

module.exports = router;
