const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const userController = require('../../../controllers/userController');

router
  .route('/profile')
  .patch(isAuthenticated, userController.updateUserProfile);

router.route('/settings', isAuthenticated).get(userController.getUserSettings);

router
  .route('/new_password')
  .post(isAuthenticated, userController.updateUserPassword);

router
  .route('/update_preferences')
  .patch(isAuthenticated, userController.updateUserPreferences);

router.route('/delete_user').delete(isAuthenticated, userController.deleteUser);

module.exports = router;
