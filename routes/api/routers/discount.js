import express from "express";
import { deleteDiscount, postDiscount } from "../../../controllers/discount.js";
import {
  checkParamsId,
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

// $TODO wat?

router
  .route("/discounts")
  // $TODO not tested
  .post(
    isAuthenticated,
    handler(postDiscount, false, (req, res, next) => ({
      ...req.body,
    }))
  );

router
  .route("/discounts/:discountId")
  // $TODO not tested
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deleteDiscount, true, (req, res, next) => ({
      ...req.params,
    }))
  );

export default router;
