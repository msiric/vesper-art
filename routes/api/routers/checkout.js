import express from "express";
import { featureFlags } from "../../../common/constants";
import { getCheckout, postDownload } from "../../../controllers/checkout";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../middleware/index";

const router = express.Router();

// FEATURE FLAG - stripe
// FEATURE FLAG - payment
featureFlags.stripe &&
  featureFlags.payment &&
  router
    .route("/checkout/:versionId")
    // $TODO not tested
    .get(
      [isAuthenticated],
      handler(getCheckout, false, (req, res, next) => ({
        versionId: req.params.versionId,
      }))
    );

router
  .route("/download/:versionId")
  // $TODO not tested
  .post(
    [isAuthenticated],
    handler(postDownload, true, (req, res, next) => ({
      versionId: req.params.versionId,
      licenseUsage: req.body.licenseUsage,
      licenseCompany: req.body.licenseCompany,
      licenseType: req.body.licenseType,
    }))
  );

export default router;
