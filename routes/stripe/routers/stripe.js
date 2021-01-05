import bodyParser from "body-parser";
import express from "express";
import {
  assignStripeId,
  createPayout,
  getStripeUser,
  managePaymentIntent,
  onboardUser,
  receiveWebhookEvent,
  redirectToStripe,
} from "../../../controllers/stripe.js";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

// $TODO Bolje to treba
router.route("/hooks", bodyParser.raw({ type: "application/json" })).post(
  handler(receiveWebhookEvent, (req, res, next) => ({
    stripeSignature: req.headers["stripe-signature"],
    stripeBody: req.rawBody,
  }))
);

router.route("/account/:accountId").get(
  isAuthenticated,
  handler(getStripeUser, (req, res, next) => ({
    ...req.params,
  }))
);

router.route("/intent/:versionId").post(
  isAuthenticated,
  handler(managePaymentIntent, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/dashboard/:accountId").get(
  isAuthenticated,
  handler(redirectToStripe, (req, res, next) => ({
    ...req.params,
    userOnboarded: res.locals.user ? res.locals.user.onboarded : null,
  }))
);

// $TODO Bolje treba sredit
router.route("/authorize").post(
  isAuthenticated,
  handler(onboardUser, (req, res, next) => ({
    sessionData: req.session,
    responseData: res.locals,
    ...req.body,
  }))
);

router.route("/token").get(
  handler(assignStripeId, (req, res, next) => ({
    responseObject: res,
    sessionData: req.session,
    queryData: req.query,
  }))
);

router.route("/payout").post(
  isAuthenticated,
  handler(createPayout, (req, res, next) => ({}))
);

export default router;
