import express from "express";
import {
  getBoughtArtwork,
  getBoughtOrders,
  getOrderDetails,
  getOrderMedia,
  getSoldOrders,
} from "../../../controllers/order";
import { postReview } from "../../../controllers/review";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../middleware/index";

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
  .route("/orders/purchases/:artworkId")
  // $TODO not tested
  .get(
    isAuthenticated,
    handler(getBoughtArtwork, false, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  );

router
  .route("/orders/:orderId")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getOrderDetails, false, (req, res, next) => ({
      orderId: req.params.orderId,
    }))
  );

// $TODO ne valja
router
  .route("/orders/:orderId/reviews")
  // $TODO not tested
  .post(
    [isAuthenticated],
    handler(postReview, true, (req, res, next) => ({
      orderId: req.params.orderId,
      reviewRating: req.body.reviewRating,
    }))
  );

router
  .route("/orders/:orderId/download")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getOrderMedia, true, (req, res, next) => ({
      orderId: req.params.orderId,
    }))
  );

export default router;
