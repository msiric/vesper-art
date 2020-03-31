const router = require('express').Router();
const { isAuthenticated, isLoggedOut } = require('../../../utils/helpers');
const authController = require('../../../controllers/authController');

router.route('/signup').post(isLoggedOut, authController.postSignUp);

router.route('/login').post(isLoggedOut, authController.postLogIn);

router.route('/logout').post(isAuthenticated, authController.postLogOut);

router.route('/refresh_token').post(authController.postRefreshToken);

router.route('/revoke_token/:id').post(authController.postRevokeToken);

module.exports = router;
