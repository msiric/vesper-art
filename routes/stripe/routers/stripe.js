import express from 'express';
import {
  isAuthenticated,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import bodyParser from 'body-parser';
import {
  receiveWebhookEvent,
  getStripeUser,
  managePaymentIntent,
  redirectToStripe,
  onboardUser,
  assignStripeId,
  createPayout,
} from '../../../controllers/stripe.js';

const router = express.Router();

// $TODO Bolje to treba
router.route('/hooks', bodyParser.raw({ type: 'application/json' })).post(
  handler(receiveWebhookEvent, true, (req, res, next) => ({
    signature: req.headers['stripe-signature'],
    body: req.rawBody,
  }))
);

router.route('/account/:accountId').get(
  isAuthenticated,
  handler(getStripeUser, false, (req, res, next) => ({
    ...req.params,
  }))
);

router.route('/intent/:artworkId').post(
  isAuthenticated,
  handler(managePaymentIntent, true, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route('/dashboard').get(
  isAuthenticated,
  handler(redirectToStripe, false, (req, res, next) => ({
    ...req.query,
    userOnboarded: res.locals.user ? res.locals.user.onboarded : null,
  }))
);

// $TODO Bolje treba sredit
router.route('/authorize').post(
  isAuthenticated,
  handler(onboardUser, false, (req, res, next) => ({
    ...req.body,
    username: res.locals.user ? res.locals.user.name : null,
  }))
);

router.route('/token').get(
  handler(assignStripeId, true, (req, res, next) => ({
    sessionState: req.session.state,
    ...req.query,
  }))
);

router.route('/payout').post(
  isAuthenticated,
  handler(createPayout, false, (req, res, next) => ({}))
);

export default router;
