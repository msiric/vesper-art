import express from "express";
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from "../../../utils/helpers.js";
import { postDiscount, deleteDiscount } from "../../../controllers/discount.js";

const router = express.Router();

router.route("/discount").post(
  isAuthenticated,
  handler(postDiscount, true, (req, res, next) => ({
    discountCode: req.body.discountCode,
  }))
);

router.route("/discount/:discountId").delete(
  [isAuthenticated, checkParamsId],
  handler(deleteDiscount, true, (req, res, next) => ({
    discountId: req.params.discountId,
  }))
);

export default router;
