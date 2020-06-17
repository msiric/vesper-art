import express from 'express';
import {
  isAuthenticated,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import order from '../../../controllers/order.js';

const router = express.Router();

router.route('/orders/sales').get(
  isAuthenticated,
  handler(order.getSoldOrders, false, (req, res, next) => ({}))
);

router.route('/orders/purchases').get(
  isAuthenticated,
  handler(order.getBoughtOrders, false, (req, res, next) => ({}))
);

router.route('/orders/:orderId').get(
  isAuthenticated,
  handler(order.getOrderDetails, false, (req, res, next) => ({
    orderId: req.params.orderId,
  }))
);

export default router;
