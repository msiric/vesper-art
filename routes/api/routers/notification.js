import express from "express";
import {
  getNotifications,
  readNotification,
  unreadNotification,
} from "../../../controllers/notification.js";
import {
  checkParamsId,
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router
  .route("/notifications")
  // $TODO not tested
  .get(
    isAuthenticated,
    handler(getNotifications, false, (req, res, next) => ({}))
  );

router
  .route("/notifications/:notificationId")
  // $TODO not tested
  .post(
    [isAuthenticated, checkParamsId],
    handler(readNotification, true, (req, res, next) => ({
      ...req.params,
    }))
  )
  // $TODO not tested
  .delete(
    [isAuthenticated, checkParamsId],
    handler(unreadNotification, true, (req, res, next) => ({
      ...req.params,
    }))
  );

export default router;
