import express from "express";
import {
  getLatestNotifications,
  getNotifications,
  getPreviousNotifications,
  readNotification,
  unreadNotification,
} from "../../../controllers/notification";
import {
  isAuthenticated,
  isAuthorized,
  requestHandler as handler,
} from "../../../middleware/index";

const router = express.Router();

// Authorized routes
router
  .route("/users/:userId/notifications")
  // TODO_ Add auth
  .get(
    [isAuthenticated, isAuthorized],
    handler(getNotifications, false, (req, res, next) => ({
      userId: req.params.userId,
    }))
  );

router
  .route("/users/:userId/notifications/:notificationId")
  // TODO_ Add auth
  .post(
    [isAuthenticated, isAuthorized],
    handler(readNotification, true, (req, res, next) => ({
      userId: req.params.userId,
      notificationId: req.params.notificationId,
    }))
  )
  // TODO_ Add auth
  .delete(
    [isAuthenticated, isAuthorized],
    handler(unreadNotification, true, (req, res, next) => ({
      userId: req.params.userId,
      notificationId: req.params.notificationId,
    }))
  );

router.route("/users/:userId/notifications/previous").get(
  [isAuthenticated, isAuthorized],
  handler(getPreviousNotifications, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    limit: req.query.limit,
  }))
);
router.route("/users/:userId/notifications/latest").get(
  [isAuthenticated, isAuthorized],
  handler(getLatestNotifications, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    limit: req.query.limit,
  }))
);

export default router;
