const router = require('express').Router();
const { isLoggedInAPI } = require('../../utils/helpers');
const orderController = require('../../controllers/orderController');

router.get(
  '/checkout/single-package/:id',
  isLoggedInAPI,
  orderController.getSingleArtwork
);

router.get(
  '/checkout/process_cart',
  isLoggedInAPI,
  orderController.getProcessCart
);

router
  .route('/payment')
  .get((req, res, next) => {
    res.render('checkout/payment', {
      amount: parseFloat(req.session.price.toFixed(12))
    });
  })
  .post(isLoggedInAPI, orderController.postPaymentSingle);

router
  .route('/payment/cart')
  .get((req, res, next) => {
    res.render('checkout/payment', {
      amount: parseFloat(req.session.price.toFixed(12))
    });
  })
  .post(isLoggedInAPI, orderController.postPaymentCart);

router.get(
  '/users/:userId/orders/:orderId',
  isLoggedInAPI,
  orderController.getOrderId
);

router.get(
  '/users/:id/manage_orders',
  isLoggedInAPI,
  orderController.getSoldOrders
);

router.get('/users/:id/orders', isLoggedInAPI, orderController.getBoughtOrders);

router.post('/add-to-cart', isLoggedInAPI, orderController.addToCart);

router.delete(
  '/remove-from-cart',
  isLoggedInAPI,
  orderController.deleteFromCart
);

module.exports = router;
