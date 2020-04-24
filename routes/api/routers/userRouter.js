const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const userController = require('../../../controllers/userController');

router
  .route('/user/:userName')
  .get(userController.getUserProfile)
  .patch(isAuthenticated, userController.updateUserProfile)
  .delete(isAuthenticated, userController.deleteUser);

router
  .route('/user/:userId/settings')
  .get(isAuthenticated, userController.getUserSettings)
  .patch(isAuthenticated, userController.updateUserPreferences);

router
  .route('/user/:userId/update_password')
  .post(isAuthenticated, userController.updateUserPassword);

module.exports = router;
