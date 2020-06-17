import express from 'express';
import {
  isAuthenticated,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import discount from '../../../controllers/discount.js';

const router = express.Router();

router.route('/discount').post(
  isAuthenticated,
  handler(discount.postDiscount, true, (req, res, next) => ({
    discountCode: req.body.discountCode,
  }))
);

router.route('/discount/:discountId').delete(
  isAuthenticated,
  handler(discount.deleteDiscount, true, (req, res, next) => ({
    discountId: req.params.discountId,
  }))
);

export default router;
