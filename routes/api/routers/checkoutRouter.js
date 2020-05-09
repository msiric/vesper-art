const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const checkoutController = require('../../../controllers/checkoutController');

// router.route('/cart').get(isAuthenticated, checkoutController.getProcessCart);

// router
//   .route('/cart/artwork/:artworkId')
//   .post(isAuthenticated, checkoutController.addToCart)
//   .delete(isAuthenticated, checkoutController.deleteFromCart);

router
  .route('/checkout')
  // $CART
  /*   .get(isAuthenticated, checkoutController.getPaymentCart) */
  .post(isAuthenticated, checkoutController.postPaymentCart);

router
  .route('/checkout/:artworkId')
  .get(isAuthenticated, checkoutController.getCheckout);

module.exports = router;
