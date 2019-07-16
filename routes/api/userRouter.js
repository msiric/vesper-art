const router = require('express').Router();
const { isLoggedInAPI, isLoggedOut } = require('../../utils/helpers');
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
  .get(isLoggedInAPI, userController.getUserProfile)
  .post(isLoggedInAPI, userController.updateUserProfile);

router.get('/logout', isLoggedInAPI, userController.getLogOut);

router.get('/settings', isLoggedInAPI, userController.getUserSettings);

router.post('/new-password', isLoggedInAPI, userController.updateUserPassword);

router.post(
  '/update-preferences',
  isLoggedInAPI,
  userController.updateUserPreferences
);

module.exports = router;
