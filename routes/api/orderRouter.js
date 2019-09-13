const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const orderController = require('../../controllers/orderController');

router.get('/checkout/cart', isLoggedIn, orderController.getProcessCart);

router.get('/checkout/:id', isLoggedIn, orderController.getSingleArtwork);

router
  .route('/payment/cart')
  .get(isLoggedIn, orderController.getPaymentCart)
  .post(isLoggedIn, orderController.postPaymentCart);

router
  .route('/payment/:id')
  .get(isLoggedIn, orderController.getPaymentSingle)
  .post(isLoggedIn, orderController.postPaymentSingle);

router.get('/orders/sold', isLoggedIn, orderController.getSoldOrders);

router.get('/orders/bought', isLoggedIn, orderController.getBoughtOrders);

router.get('/orders/:orderId', isLoggedIn, orderController.getOrderId);

router.post('/add_to_cart', isLoggedIn, orderController.addToCart);

router.delete('/remove_from_cart', isLoggedIn, orderController.deleteFromCart);

module.exports = router;
