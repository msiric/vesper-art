const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const stripeController = require('../../../controllers/stripeController');

router
  .route('/dashboard')
  .get(isAuthenticated, stripeController.redirectToStripe);

router.route('/authorize').get(isAuthenticated, stripeController.onboardUser);

router.route('/token').get(isAuthenticated, stripeController.assignStripeId);

router.route('/payout').post(isAuthenticated, stripeController.createPayout);

module.exports = router;
