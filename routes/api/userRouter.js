const router = require('express').Router();
const { isLoggedIn, isLoggedOut } = require('../../utils/helpers');
const userController = require('../../controllers/userController');

router
  .route('/signup')
  .get(isLoggedOut, userController.getSignUp)
  .post(isLoggedOut, userController.postSignUp);

router
  .route('/login')
  .get(isLoggedOut, userController.getLogIn)
  .post(isLoggedOut, userController.postLogIn);

router
  .route('/profile')
  .get(isLoggedIn, userController.getUserProfile)
  .post(isLoggedIn, userController.updateUserProfile);

router
  .get('/logout', isLoggedIn, userController.getLogOut)
  .post('/logout', isLoggedIn, userController.postLogOut);

router.get('/settings', isLoggedIn, userController.getUserSettings);

router.post('/new_password', isLoggedIn, userController.updateUserPassword);

router.post(
  '/update_preferences',
  isLoggedIn,
  userController.updateUserPreferences
);

router.post('/delete_user', isLoggedIn, userController.deleteUser);

module.exports = router;
