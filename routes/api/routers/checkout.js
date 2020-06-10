import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import checkout from '../../../controllers/checkout.js';

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

router.route('/checkout/:artworkId').get(isAuthenticated, checkout.getCheckout);

export default router;
