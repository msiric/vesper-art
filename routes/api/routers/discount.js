import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import discount from '../../../controllers/discount.js';

const router = express.Router();

router.route('/discount').post(isAuthenticated, discount.postDiscount);

router
  .route('/discount/:discountId')
  .delete(isAuthenticated, discount.deleteDiscount);

export default router;
