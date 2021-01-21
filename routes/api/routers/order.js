import express from "express";
import {
  getBoughtOrders,
  getOrderDetails,
  getOrderMedia,
  getSoldOrders,
} from "../../../controllers/order.js";
import { postReview } from "../../../controllers/review.js";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router
  .route("/orders/sales")
  // $TODO not tested
  .get(
    isAuthenticated,
    handler(getSoldOrders, false, (req, res, next) => ({}))
  );

router
  .route("/orders/purchases")
  // $TODO not tested
  .get(
    isAuthenticated,
    handler(getBoughtOrders, false, (req, res, next) => ({}))
  );

router
  .route("/orders/:orderId")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getOrderDetails, false, (req, res, next) => ({
      ...req.params,
    }))
  );

// $TODO ne valja
router
  .route("/orders/:orderId/reviews")
  // $TODO not tested
  .post(
    [isAuthenticated],
    handler(postReview, true, (req, res, next) => ({
      ...req.body,
      ...req.params,
    }))
  );

router
  .route("/orders/:orderId/download")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getOrderMedia, true, (req, res, next) => ({
      ...req.params,
      response: res,
    }))
  );

export default router;
