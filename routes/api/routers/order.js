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
  isAuthorized,
  requestHandler as handler,
} from "../../../middleware/index";

const router = express.Router();

// Authorized routes
router
  .route("/users/:userId/orders/sales")
  // TODO_ Add auth + add userId
  .get(
    [isAuthenticated, isAuthorized],
    handler(getSoldOrders, false, (req, res, next) => ({
      userId: req.params.userId,
    }))
  );

router
  .route("/users/:userId/orders/purchases")
  // TODO_ Add auth + add userId
  .get(
    [isAuthenticated, isAuthorized],
    handler(getBoughtOrders, false, (req, res, next) => ({
      userId: req.params.userId,
    }))
  );

router
  .route("/users/:userId/orders/purchases/:artworkId")
  // TODO_ Add auth + add userId
  .get(
    [isAuthenticated, isAuthorized],
    handler(getBoughtArtwork, false, (req, res, next) => ({
      userId: req.params.userId,
      artworkId: req.params.artworkId,
    }))
  );

router
  .route("/users/:userId/orders/:orderId")
  // TODO_ Add auth + add userId
  .get(
    [isAuthenticated, isAuthorized],
    handler(getOrderDetails, false, (req, res, next) => ({
      userId: req.params.userId,
      orderId: req.params.orderId,
    }))
  );

// $TODO ne valja
router
  .route("/users/:userId/orders/:orderId/reviews")
  // TODO_ Add auth + add userId
  .post(
    [isAuthenticated, isAuthorized],
    handler(postReview, true, (req, res, next) => ({
      userId: req.params.userId,
      orderId: req.params.orderId,
      reviewRating: req.body.reviewRating,
    }))
  );

router
  .route("/users/:userId/orders/:orderId/download")
  // TODO_ Add auth + add userId
  .get(
    [isAuthenticated, isAuthorized],
    handler(getOrderMedia, true, (req, res, next) => ({
      userId: req.params.userId,
      orderId: req.params.orderId,
    }))
  );

export default router;
