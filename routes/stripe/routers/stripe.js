import express from "express";
import { featureFlags } from "../../../common/constants";
import {
  assignStripeId,
  createPayout,
  fetchIntentById,
  getStripeUser,
  managePaymentIntent,
  onboardUser,
  redirectToDashboard,
  redirectToStripe,
} from "../../../controllers/stripe";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../middleware/index";

// $TODO no automated tests
const router = express.Router();

router.route("/account/:accountId").get(
  isAuthenticated,
  handler(getStripeUser, false, (req, res, next) => ({
    accountId: req.params.accountId,
  }))
);

// ovo je test za novi checkout (trenutno delayed)
// FEATURE FLAG - payment
featureFlags.payment &&
  router.route("/intent/:intentId").get(
    isAuthenticated,
    handler(fetchIntentById, false, (req, res, next) => ({
      intentId: req.params.intentId,
    }))
  );

// FEATURE FLAG - payment
featureFlags.payment &&
  router.route("/intent/:versionId").post(
    isAuthenticated,
    handler(managePaymentIntent, true, (req, res, next) => ({
      versionId: req.params.versionId,
      discountId: req.body.discountId,
      licenseUsage: req.body.licenseUsage,
      licenseCompany: req.body.licenseCompany,
      licenseType: req.body.licenseType,
    }))
  );

router
  .route("/dashboard/")
  .get(handler(redirectToDashboard, false, (req, res, next) => ({})));

router.route("/dashboard/:accountId").get(
  isAuthenticated,
  handler(redirectToStripe, false, (req, res, next) => ({
    accountId: req.params.accountId,
    userOnboarded: res.locals.user ? res.locals.user.onboarded : null,
  }))
);

// $TODO Bolje treba sredit
router.route("/authorize").post(
  isAuthenticated,
  handler(onboardUser, true, (req, res, next) => ({
    session: req.session,
    locals: res.locals,
    userBusinessAddress: req.body.userBusinessAddress,
    userEmail: req.body.userEmail,
  }))
);

router.route("/token").get(
  handler(assignStripeId, true, (req, res, next) => ({
    session: req.session,
    state: req.query.state,
    code: req.query.code,
  }))
);

router.route("/payout").post(
  isAuthenticated,
  handler(createPayout, true, (req, res, next) => ({}))
);

export default router;
