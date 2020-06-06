import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import bodyParser from 'body-parser';
import stripe from '../../../controllers/stripe.js';

const router = express.Router();

router
  .route('/hooks', bodyParser.raw({ type: 'application/json' }))
  .post(stripe.receiveWebhookEvent);

router.route('/account/:accountId').get(isAuthenticated, stripe.getStripeUser);

router
  .route('/intent/:artworkId')
  .post(isAuthenticated, stripe.managePaymentIntent);

router.route('/dashboard').get(isAuthenticated, stripe.redirectToStripe);

router.route('/authorize').post(isAuthenticated, stripe.onboardUser);

router.route('/token').get(stripe.assignStripeId);

router.route('/payout').post(isAuthenticated, stripe.createPayout);

export default router;
