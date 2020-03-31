const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const checkoutController = require('../../../controllers/checkoutController');

router.route('/cart').get(isAuthenticated, checkoutController.getProcessCart);

router
  .route('/checkout')
  .get(isAuthenticated, checkoutController.getPaymentCart)
  .post(isAuthenticated, checkoutController.postPaymentCart);

router
  .route('/add_to_cart')
  .post(isAuthenticated, checkoutController.addToCart);

router
  .route('/remove_from_cart')
  .delete(isAuthenticated, checkoutController.deleteFromCart);

router
  .route('/increase_quantity')
  .post(isAuthenticated, checkoutController.increaseArtwork);

router
  .route('/decrease_quantity')
  .post(isAuthenticated, checkoutController.decreaseArtwork);

module.exports = router;
