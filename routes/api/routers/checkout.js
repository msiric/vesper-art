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
        ...req.params,
      }))
    );

router
  .route("/download/:versionId")
  // $TODO not tested
  .post(
    [isAuthenticated],
    handler(postDownload, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

export default router;
