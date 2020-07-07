import express from "express";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";
import bodyParser from "body-parser";
import {
  receiveWebhookEvent,
  getStripeUser,
  managePaymentIntent,
  redirectToStripe,
  onboardUser,
  assignStripeId,
  createPayout,
} from "../../../controllers/stripe.js";

const router = express.Router();

// $TODO Bolje to treba
router.route("/hooks", bodyParser.raw({ type: "application/json" })).post(
  handler(receiveWebhookEvent, true, (req, res, next) => ({
    signature: req.headers["stripe-signature"],
    body: req.rawBody,
  }))
);

router.route("/account/:accountId").get(
  isAuthenticated,
  handler(getStripeUser, false, (req, res, next) => ({
    accountId: req.params.accountId,
  }))
);

router.route("/intent/:artworkId").post(
  isAuthenticated,
  handler(managePaymentIntent, true, (req, res, next) => ({
    artworkId: req.params.artworkId,
    licenses: req.body.licenses,
    intentId: req.body.intentId,
  }))
);

router.route("/dashboard").get(
  isAuthenticated,
  handler(redirectToStripe, false, (req, res, next) => ({
    userAccount: req.query.account,
    userOnboarded: res.locals.user ? res.locals.user.onboarded : null,
  }))
);

// $TODO Bolje treba sredit
router.route("/authorize").post(
  isAuthenticated,
  handler(onboardUser, false, (req, res, next) => ({
    country: req.body.country,
    email: req.body.email,
    username: res.locals.user ? res.locals.user.name : null,
  }))
);

router.route("/token").get(
  handler(assignStripeId, true, (req, res, next) => ({
    sessionState: req.session.state,
    queryState: req.query.state,
  }))
);

router.route("/payout").post(
  isAuthenticated,
  handler(createPayout, false, (req, res, next) => ({}))
);

export default router;
