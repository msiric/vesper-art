import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import review from '../../../controllers/review.js';

const router = express.Router();

router.route('/rate_artwork/:orderId').post(isAuthenticated, review.postReview);

export default router;
