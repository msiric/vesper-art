import express from "express";
import { getDiscount } from "../../../controllers/discount.js";
import {
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
    handler(getDiscount, false, (req, res, next) => ({
      ...req.body,
    }))
  );

export default router;
