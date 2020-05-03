const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const orderController = require('../../../controllers/orderController');

router
  .route('/orders/sold')
  .get(isAuthenticated, orderController.getSoldOrders);

router
  .route('/orders/bought')
  .get(isAuthenticated, orderController.getBoughtOrders);

router.route('/orders/:orderId').get(isAuthenticated, orderController.getOrder);

module.exports = router;