const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const orderController = require('../../controllers/orderController');

router.get('/checkout/cart', isLoggedIn, orderController.getProcessCart);

router
  .route('/payment/cart')
  .get(isLoggedIn, orderController.getPaymentCart)
  .post(isLoggedIn, orderController.postPaymentCart);

router.get('/orders/sold', isLoggedIn, orderController.getSoldOrders);

router.get('/orders/bought', isLoggedIn, orderController.getBoughtOrders);

router.get('/orders/:orderId', isLoggedIn, orderController.getOrderId);

router.post('/add_to_cart', isLoggedIn, orderController.addToCart);

router.delete('/remove_from_cart', isLoggedIn, orderController.deleteFromCart);

router.post(
  '/increase_artwork_quantity',
  isLoggedIn,
  orderController.increaseArtwork
);

router.post(
  '/decrease_artwork_quantity',
  isLoggedIn,
  orderController.decreaseArtwork
);

module.exports = router;
