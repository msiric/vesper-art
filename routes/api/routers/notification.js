import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import notification from '../../../controllers/notification.js';

const router = express.Router();

router
  .route('/notifications')
  .get(isAuthenticated, notification.getNotifications);

router
  .route('/read_notification/:notificationId')
  .patch(isAuthenticated, notification.readNotification);

router
  .route('/unread_notification/:notificationId')
  .patch(isAuthenticated, notification.unreadNotification);

export default router;
