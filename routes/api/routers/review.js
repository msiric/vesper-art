import express from "express";
import { postReview } from "../../../controllers/review.js";
import {
  checkParamsId,
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router.route("/orders/:orderId/ratings").post(
  [isAuthenticated, checkParamsId],
  handler(postReview, (req, res, next) => ({
    ...req.body,
    ...req.params,
  }))
);

export default router;
