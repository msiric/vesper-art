const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const orderController = require('../../controllers/orderController');

router.get(
  '/checkout/single-package/:id',
  isLoggedIn,
  orderController.getSingleArtwork
);

router.get(
  '/checkout/process_cart',
  isLoggedIn,
  orderController.getProcessCart
);

router
  .route('/payment/cart')
  .get(isLoggedIn, orderController.getPaymentCart)
  .post(isLoggedIn, orderController.postPaymentCart);

router
  .route('/payment/:id')
  .get(isLoggedIn, orderController.getPaymentSingle)
  .post(isLoggedIn, orderController.postPaymentSingle);

router.get(
  '/users/:userId/orders/:orderId',
  isLoggedIn,
  orderController.getOrderId
);

router.get(
  '/users/:id/manage_orders',
  isLoggedIn,
  orderController.getSoldOrders
);

router.get('/users/:id/orders', isLoggedIn, orderController.getBoughtOrders);

router.post('/add-to-cart', isLoggedIn, orderController.addToCart);

router.delete('/remove-from-cart', isLoggedIn, orderController.deleteFromCart);

module.exports = router;
