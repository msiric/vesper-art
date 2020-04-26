const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const userController = require('../../../controllers/userController');

router
  .route('/user/:userName')
  .get(userController.getUserProfile)
  .delete(isAuthenticated, userController.deleteUser);

router
  .route('/user/:userId/settings')
  .get(isAuthenticated, userController.getUserSettings);

router
  .route('/user/:userId/preferences')
  .patch(isAuthenticated, userController.updateUserPreferences);

router
  .route('/user/:userId/update_email')
  .patch(isAuthenticated, userController.updateUserEmail);

router
  .route('/user/:userId/update_password')
  .patch(isAuthenticated, userController.updateUserPassword);

module.exports = router;
