const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const checkoutController = require('../../../controllers/checkoutController');

router
  .route('/secret')
  .get(isAuthenticated, checkoutController.getStripeSecret);

router.route('/cart').get(isAuthenticated, checkoutController.getProcessCart);

router
  .route('/cart/artwork/:artworkId')
  .post(isAuthenticated, checkoutController.addToCart)
  .delete(isAuthenticated, checkoutController.deleteFromCart);

router
  .route('/checkout')
  .get(isAuthenticated, checkoutController.getPaymentCart)
  .post(isAuthenticated, checkoutController.postPaymentCart);

module.exports = router;