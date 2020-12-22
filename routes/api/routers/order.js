import express from 'express';
import {
  downloadOrderArtwork,
  getBoughtOrders,
  getOrderDetails,
  getSoldOrders,
} from '../../../controllers/order.js';
import {
  checkParamsId,
  isAuthenticated,
  requestHandler as handler,
} from '../../../utils/helpers.js';

const router = express.Router();

router.route('/orders/sales').get(
  isAuthenticated,
  handler(getSoldOrders, false, (req, res, next) => ({}))
);

router.route('/orders/purchases').get(
  isAuthenticated,
  handler(getBoughtOrders, false, (req, res, next) => ({}))
);

router.route('/orders/:orderId').get(
  [isAuthenticated, checkParamsId],
  handler(getOrderDetails, false, (req, res, next) => ({
    ...req.params,
  }))
);

router.route('/orders/:orderId/download').get(
  [isAuthenticated, checkParamsId],
  handler(downloadOrderArtwork, false, (req, res, next) => ({
    ...req.params,
    response: res,
  }))
);

export default router;
