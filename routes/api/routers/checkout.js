import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import { getCheckout } from '../../../controllers/checkout.js';

const router = express.Router();

// router.route('/cart').get(isAuthenticated, checkout .getProcessCart);

// router
//   .route('/cart/artwork/:artworkId')
//   .post(isAuthenticated, checkout .addToCart)
//   .delete(isAuthenticated, checkout .deleteFromCart);

router.route('/checkout');
// $CART
/*   .get(isAuthenticated, checkout .getPaymentCart) */
/*   .post(isAuthenticated, checkout.postPaymentCart); */

router.route('/checkout/:artworkId').get(
  [isAuthenticated, checkParamsId],
  handler(getCheckout, false, (req, res, next) => ({
    ...req.params,
  }))
);

export default router;
