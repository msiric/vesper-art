import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import review from '../../../controllers/review.js';

const router = express.Router();

router.route('/rate_artwork/:orderId').post(
  [isAuthenticated, checkParamsId],
  handler(review.postReview, true, (req, res, next) => ({
    reviewRating: req.body.reviewRating,
    reviewContent: req.body.reviewContent,
    orderId: req.params.orderId,
  }))
);

export default router;
