const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const orderController = require('../../../controllers/orderController');

router
  .route('/orders/sales')
  .get(isAuthenticated, orderController.getSoldOrders);

router
  .route('/orders/purchases')
  .get(isAuthenticated, orderController.getBoughtOrders);

router
  .route('/orders/:orderId')
  .get(isAuthenticated, orderController.getOrderDetails);

module.exports = router;
