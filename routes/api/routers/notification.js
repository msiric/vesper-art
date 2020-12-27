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

router.route("/notifications").get(
  isAuthenticated,
  handler(getNotifications, (req, res, next) => ({}))
);

// $TODO ne valja ruta nista
router.route("/read_notification/:notificationId").patch(
  [isAuthenticated, checkParamsId],
  handler(readNotification, (req, res, next) => ({
    ...req.params,
  }))
);

// $TODO ne valja ruta nista
router.route("/unread_notification/:notificationId").patch(
  [isAuthenticated, checkParamsId],
  handler(unreadNotification, (req, res, next) => ({
    ...req.params,
  }))
);

export default router;
