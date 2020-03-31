const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const notificationController = require('../../../controllers/notificationController');

router
  .route('/notifications')
  .get(isAuthenticated, notificationController.getNotifications);

module.exports = router;
