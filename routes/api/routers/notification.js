import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import notification from '../../../controllers/notification.js';

const router = express.Router();

router.route('/notifications').get(
  isAuthenticated,
  handler(notification.getNotifications, false, (req, res, next) => ({}))
);

router.route('/read_notification/:notificationId').patch(
  [isAuthenticated, checkParamsId],
  handler(notification.readNotification, false, (req, res, next) => ({
    notificationId: req.params.notificationId,
  }))
);

router.route('/unread_notification/:notificationId').patch(
  [isAuthenticated, checkParamsId],
  handler(notification.unreadNotification, false, (req, res, next) => ({
    notificationId: req.params.notificationId,
  }))
);

export default router;
