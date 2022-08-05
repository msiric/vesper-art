import express from "express";
import { featureFlags } from "../../../common/constants";
import { getDiscount, postDiscount } from "../../../controllers/discount";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../middleware/index";

const router = express.Router();

// $TODO not tested
// FEATURE FLAG - stripe
// FEATURE FLAG - payment
// FEATURE FLAG - discount
featureFlags.stripe &&
  featureFlags.payment &&
  featureFlags.discount &&
  router.route("/discounts/:discountCode").get(
    isAuthenticated,
    handler(getDiscount, false, (req, res, next) => ({
      discountCode: req.params.discountCode,
    }))
  );

// $TODO REMOVE (ONLY FOR DEV)
router.route("/discounts").post(
  isAuthenticated,
  handler(postDiscount, true, (req, res, next) => ({
    discountData: req.body.discountData,
  }))
);

export default router;
