import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import { getCheckout } from '../../../controllers/checkout.js';

const router = express.Router();

router.route('/checkout/:artworkId').get(
  [isAuthenticated, checkParamsId],
  handler(getCheckout, false, (req, res, next) => ({
    ...req.params,
  }))
);

export default router;
