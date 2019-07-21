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
  .route('/payment')
  .get((req, res, next) => {
    res.render('checkout/payment', {
      amount: parseFloat(req.session.price.toFixed(12))
    });
  })
  .post(isLoggedIn, orderController.postPaymentSingle);

router
  .route('/payment/cart')
  .get((req, res, next) => {
    res.render('checkout/payment', {
      amount: parseFloat(req.session.price.toFixed(12))
    });
  })
  .post(isLoggedIn, orderController.postPaymentCart);

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
