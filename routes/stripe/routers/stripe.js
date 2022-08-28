import express from "express";
import { featureFlags } from "../../../common/constants";
import {
  authorizeUser,
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

// $TODO the four routes below need proper authorization

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

router
  .route("/dashboard/")
  .get(handler(redirectToDashboard, false, (req, res, next) => ({})));

router.route("/dashboard/:accountId").get(
  isAuthenticated,
  handler(redirectToStripe, false, (req, res, next) => ({
    accountId: req.params.accountId,
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

// $TODO Bolje treba sredit
router.route("/authorize").post(
  isAuthenticated,
  handler(authorizeUser, true, (req, res, next) => ({
    userBusinessAddress: req.body.userBusinessAddress,
    userEmail: req.body.userEmail,
  }))
);

router.route("/onboard").get(
  isAuthenticated,
  handler(onboardUser, true, (req, res, next) => ({}))
);

// router.route("/payout").post(
//   isAuthenticated,
//   handler(createPayout, true, (req, res, next) => ({}))
// );

export default router;
