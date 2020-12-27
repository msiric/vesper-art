import express from "express";
import {
  downloadOrderArtwork,
  getBoughtOrders,
  getOrderDetails,
  getSoldOrders,
} from "../../../controllers/order.js";
import { postReview } from "../../../controllers/review.js";
import {
  checkParamsId,
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router.route("/orders/sales").get(
  isAuthenticated,
  handler(getSoldOrders, (req, res, next) => ({}))
);

router.route("/orders/purchases").get(
  isAuthenticated,
  handler(getBoughtOrders, (req, res, next) => ({}))
);

router.route("/orders/:orderId").get(
  [isAuthenticated, checkParamsId],
  handler(getOrderDetails, (req, res, next) => ({
    ...req.params,
  }))
);

router.route("/orders/:orderId/ratings").post(
  [isAuthenticated, checkParamsId],
  handler(postReview, (req, res, next) => ({
    ...req.body,
    ...req.params,
  }))
);

router.route("/orders/:orderId/download").get(
  [isAuthenticated, checkParamsId],
  handler(downloadOrderArtwork, (req, res, next) => ({
    ...req.params,
    response: res,
  }))
);

export default router;
