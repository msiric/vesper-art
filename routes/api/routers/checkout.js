import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import { getCheckout } from '../../../controllers/checkout.js';

const router = express.Router();

// router.route('/cart').get(handler(isAuthenticated, false, (req, res, next) => (req, res, next)), checkout .getProcessCart);

// router
//   .route('/cart/artwork/:artworkId')
//   .post(handler(isAuthenticated, false, (req, res, next) => (req, res, next)), checkout .addToCart)
//   .delete(handler(isAuthenticated, false, (req, res, next) => (req, res, next)), checkout .deleteFromCart);

router.route('/checkout');
// $CART
/*   .get(handler(isAuthenticated, false, (req, res, next) => (req, res, next)), checkout .getPaymentCart) */
/*   .post(handler(isAuthenticated, false, (req, res, next) => (req, res, next)), checkout.postPaymentCart); */

router.route('/checkout/:artworkId').get(
  [
    handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
    handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  ],
  handler(getCheckout, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
  }))
);

export default router;
