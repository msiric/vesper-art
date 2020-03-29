const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const userController = require('../../../controllers/userController');

router
  .route('/profile')
  .post(isAuthenticated, userController.updateUserProfile);

router.get('/settings', isAuthenticated, userController.getUserSettings);

router.post(
  '/new_password',
  isAuthenticated,
  userController.updateUserPassword
);

router.post(
  '/update_preferences',
  isAuthenticated,
  userController.updateUserPreferences
);

router.post('/delete_user', isAuthenticated, userController.deleteUser);

module.exports = router;
