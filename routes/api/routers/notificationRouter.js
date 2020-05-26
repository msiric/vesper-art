const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const notificationController = require('../../../controllers/notificationController');

router
  .route('/notifications')
  .get(isAuthenticated, notificationController.getNotifications);

router
  .route('/read_notification/:notificationId')
  .patch(isAuthenticated, notificationController.readNotification);

router
  .route('/unread_notification/:notificationId')
  .patch(isAuthenticated, notificationController.unreadNotification);

module.exports = router;
