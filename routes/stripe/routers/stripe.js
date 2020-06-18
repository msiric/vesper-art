import express from 'express';
import {
  isAuthenticated,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import bodyParser from 'body-parser';
import stripe from '../../../controllers/stripe.js';

const router = express.Router();

// $TODO Bolje to treba
router
  .route('/hooks', bodyParser.raw({ type: 'application/json' }))
  .post(
    handler(
      stripe.receiveWebhookEvent,
      false,
      (req, res, next) => (req, res, next)
    )
  );

router.route('/account/:accountId').get(
  isAuthenticated,
  handler(stripe.getStripeUser, false, (req, res, next) => ({
    accountId: req.params.accountId,
  }))
);

router.route('/intent/:artworkId').post(
  isAuthenticated,
  handler(stripe.managePaymentIntent, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    licenses: req.body.licenses,
    intentId: req.body.intentId,
  }))
);

router.route('/dashboard').get(
  isAuthenticated,
  handler(stripe.redirectToStripe, false, (req, res, next) => ({
    userOnboarded: res.locals.user ? res.locals.user.onboarded : null,
  }))
);

// $TODO Bolje treba sredit
router.route('/authorize').post(
  isAuthenticated,
  handler(stripe.onboardUser, false, (req, res, next) => ({
    country: req.body.country,
    email: req.body.email,
    username: res.locals.user ? res.locals.user.name : null,
  }))
);

router
  .route('/token')
  .get(handler(stripe.assignStripeId, true, (req, res, next) => req));

router.route('/payout').post(
  isAuthenticated,
  handler(stripe.createPayout, false, (req, res, next) => ({}))
);

export default router;
