import express from "express";
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from "../../../utils/helpers.js";
import {
  getSoldOrders,
  getBoughtOrders,
  getOrderDetails,
} from "../../../controllers/order.js";

const router = express.Router();

router.route("/orders/:orderId").get(
  [isAuthenticated, checkParamsId],
  handler(getOrderDetails, false, (req, res, next) => ({
    orderId: req.params.orderId,
  }))
);

router.route("/orders/sales").get(
  isAuthenticated,
  handler(getSoldOrders, false, (req, res, next) => ({}))
);

router.route("/orders/purchases").get(
  isAuthenticated,
  handler(getBoughtOrders, false, (req, res, next) => ({}))
);

export default router;
