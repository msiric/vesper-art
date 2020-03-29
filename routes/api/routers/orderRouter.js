const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const orderController = require('../../../controllers/orderController');

router.get('/checkout/cart', isAuthenticated, orderController.getProcessCart);

router
  .route('/payment/cart')
  .get(isAuthenticated, orderController.getPaymentCart)
  .post(isAuthenticated, orderController.postPaymentCart);

router.get('/orders/sold', isAuthenticated, orderController.getSoldOrders);

router.get('/orders/bought', isAuthenticated, orderController.getBoughtOrders);

router.get('/orders/:orderId', isAuthenticated, orderController.getOrderId);

router.post('/add_to_cart', isAuthenticated, orderController.addToCart);

router.delete(
  '/remove_from_cart',
  isAuthenticated,
  orderController.deleteFromCart
);

router.post(
  '/increase_artwork_quantity',
  isAuthenticated,
  orderController.increaseArtwork
);

router.post(
  '/decrease_artwork_quantity',
  isAuthenticated,
  orderController.decreaseArtwork
);

router.get(
  '/license_information/:artworkId',
  isAuthenticated,
  orderController.getLicenseInformation
);

module.exports = router;
