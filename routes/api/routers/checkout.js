import express from 'express';
import { getCheckout } from '../../../controllers/checkout.js';
import {
  checkParamsId,
  isAuthenticated,
  requestHandler as handler,
} from '../../../utils/helpers.js';

const router = express.Router();

router.route('/checkout/:versionId').get(
  [isAuthenticated, checkParamsId],
  handler(getCheckout, false, (req, res, next) => ({
    ...req.params,
  }))
);

export default router;
