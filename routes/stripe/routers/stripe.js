import bodyParser from "body-parser";
import express from "express";
import { featureFlags } from "../../../common/constants";
import {
  assignStripeId,
  createPayout,
  fetchIntentById,
  getStripeUser,
  managePaymentIntent,
  onboardUser,
  receiveWebhookEvent,
  redirectToDashboard,
  redirectToStripe,
} from "../../../controllers/stripe";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers";

const router = express.Router();

// $TODO Bolje to treba
router.route("/hooks", bodyParser.raw({ type: "application/json" })).post(
  handler(receiveWebhookEvent, true, (req, res, next) => ({
    stripeSignature: req.headers["stripe-signature"],
    stripeBody: req.rawBody,
  }))
);

router.route("/account/:accountId").get(
  isAuthenticated,
  handler(getStripeUser, false, (req, res, next) => ({
    ...req.params,
  }))
);

// ovo je test za novi checkout (trenutno delayed)
// FEATURE FLAG - payment
featureFlags.payment &&
  router.route("/intent/:intentId").get(
    isAuthenticated,
    handler(fetchIntentById, false, (req, res, next) => ({
      ...req.params,
    }))
  );

// FEATURE FLAG - payment
featureFlags.payment &&
  router.route("/intent/:versionId").post(
    isAuthenticated,
    handler(managePaymentIntent, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router.route("/dashboard/").get(
  handler(redirectToDashboard, false, (req, res, next) => ({
    ...req.params,
  }))
);

router.route("/dashboard/:accountId").get(
  isAuthenticated,
  handler(redirectToStripe, false, (req, res, next) => ({
    ...req.params,
    userOnboarded: res.locals.user ? res.locals.user.onboarded : null,
  }))
);

// $TODO Bolje treba sredit
router.route("/authorize").post(
  isAuthenticated,
  handler(onboardUser, true, (req, res, next) => ({
    sessionData: req.session,
    responseData: res.locals,
    ...req.body,
  }))
);

router.route("/token").get(
  handler(assignStripeId, true, (req, res, next) => ({
    sessionData: req.session,
    queryData: req.query,
  }))
);

router.route("/payout").post(
  isAuthenticated,
  handler(createPayout, true, (req, res, next) => ({}))
);

export default router;
