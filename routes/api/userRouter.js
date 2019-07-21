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

router.get('/auth/facebook', isLoggedOut, userController.getFacebookLogIn);

router.get('/auth/facebook/callback', userController.getFacebookCallback);

router.get('/auth/google', isLoggedOut, userController.getGoogleLogIn);

router.get('/auth/google/callback', userController.getGoogleCallback);

router
  .route('/profile')
  .get(isLoggedIn, userController.getUserProfile)
  .post(isLoggedIn, userController.updateUserProfile);

router.get('/logout', isLoggedIn, userController.getLogOut);

router.get('/settings', isLoggedIn, userController.getUserSettings);

router.post('/new-password', isLoggedIn, userController.updateUserPassword);

router.post(
  '/update-preferences',
  isLoggedIn,
  userController.updateUserPreferences
);

module.exports = router;
