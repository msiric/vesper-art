import express from "express";
import { getCheckout, postDownload } from "../../../controllers/checkout.js";
import {
  checkParamsId,
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router
  .route("/checkout/:versionId")
  // $TODO not tested
  .get(
    [isAuthenticated, checkParamsId],
    handler(getCheckout, false, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/download/:versionId")
  // $TODO not tested
  .post(
    [isAuthenticated, checkParamsId],
    handler(postDownload, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

export default router;
