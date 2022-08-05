import express from "express";
import {
  getNotifications,
  readNotification,
  unreadNotification,
} from "../../../controllers/notification";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../middleware/index";

const router = express.Router();

router
  .route("/notifications")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getNotifications, false, (req, res, next) => ({}))
  );

router
  .route("/notifications/:notificationId")
  // $TODO not tested
  .post(
    [isAuthenticated],
    handler(readNotification, true, (req, res, next) => ({
      notificationId: req.params.notificationId,
    }))
  )
  // $TODO not tested
  .delete(
    [isAuthenticated],
    handler(unreadNotification, true, (req, res, next) => ({
      notificationId: req.params.notificationId,
    }))
  );

export default router;
