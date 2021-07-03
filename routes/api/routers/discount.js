import express from "express";
import { featureFlags } from "../../../common/constants.js";
import { getDiscount, postDiscount } from "../../../controllers/discount.js";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

// $TODO not tested
// FEATURE FLAG - stripe
// FEATURE FLAG - payment
featureFlags.stripe &&
  featureFlags.payment &&
  router.route("/discounts/:discountCode").get(
    isAuthenticated,
    handler(getDiscount, false, (req, res, next) => ({
      ...req.params,
    }))
  );

// $TODO REMOVE (ONLY FOR DEV)
router.route("/discounts").post(
  isAuthenticated,
  handler(postDiscount, true, (req, res, next) => ({
    ...req.body,
  }))
);

export default router;
