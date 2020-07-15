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
  isAuthenticated,
  handler(getNotifications, false, (req, res, next) => ({}))
);

router.route('/read_notification/:notificationId').patch(
  [isAuthenticated, checkParamsId],
  handler(readNotification, false, (req, res, next) => ({
    ...req.params,
  }))
);

router.route('/unread_notification/:notificationId').patch(
  [isAuthenticated, checkParamsId],
  handler(unreadNotification, false, (req, res, next) => ({
    ...req.params,
  }))
);

export default router;
