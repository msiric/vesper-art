import express from 'express';
import { getCheckout, postDownload } from '../../../controllers/checkout.js';
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

router.route('/download/:versionId').post(
  [isAuthenticated, checkParamsId],
  handler(postDownload, false, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

export default router;
