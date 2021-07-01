import express from "express";
import { featureFlags } from "../../../common/constants.js";
import { getCheckout, postDownload } from "../../../controllers/checkout.js";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

// FEATURE FLAG - stripe
featureFlags.stripe &&
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
