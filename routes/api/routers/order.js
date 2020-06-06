import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import order from '../../../controllers/order.js';

const router = express.Router();

router.route('/orders/sales').get(isAuthenticated, order.getSoldOrders);

router.route('/orders/purchases').get(isAuthenticated, order.getBoughtOrders);

router.route('/orders/:orderId').get(isAuthenticated, order.getOrderDetails);

export default router;
