const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const stripeController = require('../../../controllers/stripeController');
const bodyParser = require('body-parser');

router
  .route('/webhook', bodyParser.raw({ type: 'application/json' }))
  .post(stripeController.receiveWebhookEvent);

router
  .route('/intent/:artworkId')
  .post(isAuthenticated, stripeController.managePaymentIntent);

router
  .route('/dashboard')
  .get(isAuthenticated, stripeController.redirectToStripe);

router.route('/authorize').post(isAuthenticated, stripeController.onboardUser);

router.route('/token').get(stripeController.assignStripeId);

router.route('/payout').post(isAuthenticated, stripeController.createPayout);

module.exports = router;
