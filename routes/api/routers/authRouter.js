const router = require('express').Router();
const {
  isAuthenticated,
  isNotAuthenticated
} = require('../../../utils/helpers');
const authController = require('../../../controllers/authController');

router.route('/signup').post(isNotAuthenticated, authController.postSignUp);

router.route('/login').post(isNotAuthenticated, authController.postLogIn);

router.route('/logout').post(isAuthenticated, authController.postLogOut);

router.route('/refresh_token').post(authController.postRefreshToken);

router.route('/revoke_token/:id').post(authController.postRevokeToken);

module.exports = router;
