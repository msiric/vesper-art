import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import {
  getSoldOrders,
  getBoughtOrders,
  getOrderDetails,
} from '../../../controllers/order.js';

const router = express.Router();

router.route('/orders/:orderId').get(
  [
    handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
    handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  ],
  handler(getOrderDetails, false, (req, res, next) => ({
    orderId: req.params.orderId,
  }))
);

router.route('/orders/sales').get(
  handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
  handler(getSoldOrders, false, (req, res, next) => ({}))
);

router.route('/orders/purchases').get(
  handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
  handler(getBoughtOrders, false, (req, res, next) => ({}))
);

export default router;
