const router = require('express').Router();
const { isLoggedIn } = require('../../../utils/helpers');
const userController = require('../../../controllers/userController');

router.route('/profile').post(isLoggedIn, userController.updateUserProfile);

router.get('/settings', isLoggedIn, userController.getUserSettings);

router.post('/new_password', isLoggedIn, userController.updateUserPassword);

router.post(
  '/update_preferences',
  isLoggedIn,
  userController.updateUserPreferences
);

router.post('/delete_user', isLoggedIn, userController.deleteUser);

module.exports = router;
