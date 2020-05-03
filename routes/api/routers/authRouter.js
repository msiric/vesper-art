const router = require('express').Router();
const {
  isAuthenticated,
  isNotAuthenticated,
} = require('../../../utils/helpers');
const authController = require('../../../controllers/authController');

router.route('/signup').post(isNotAuthenticated, authController.postSignUp);

router.route('/login').post(isNotAuthenticated, authController.postLogIn);

router.route('/logout').post(isAuthenticated, authController.postLogOut);

router.route('/refresh_token').post(authController.postRefreshToken);

router.route('/revoke_token/:userId').post(authController.postRevokeToken);

router
  .route('/verify_token/:tokenId')
  .get(isNotAuthenticated, authController.verifyRegisterToken);

router
  .route('/forgot_password')
  .post(isNotAuthenticated, authController.forgotPassword);

router
  .route('/reset_password/:tokenId')
  .post(isNotAuthenticated, authController.resetPassword);

module.exports = router;
