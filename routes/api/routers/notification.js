import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import {
  getNotifications,
  readNotification,
  unreadNotification,
} from '../../../controllers/notification.js';

const router = express.Router();

router.route('/notifications').get(
  handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
  handler(getNotifications, false, (req, res, next) => ({}))
);

router.route('/read_notification/:notificationId').patch(
  [
    handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
    handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  ],
  handler(readNotification, false, (req, res, next) => ({
    notificationId: req.params.notificationId,
  }))
);

router.route('/unread_notification/:notificationId').patch(
  [
    handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
    handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  ],
  handler(unreadNotification, false, (req, res, next) => ({
    notificationId: req.params.notificationId,
  }))
);

export default router;
