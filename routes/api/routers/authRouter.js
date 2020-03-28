const router = require('express').Router();
const { isLoggedIn, isLoggedOut } = require('../../../utils/helpers');
const authController = require('../../../controllers/authController');

router.route('/signup').post(isLoggedOut, authController.postSignUp);

router.route('/login').post(isLoggedOut, authController.postLogIn);

router.post('/logout', isLoggedIn, authController.postLogOut);

router.post('/refresh_token', authController.postRefreshToken);

router.post('/revoke_token/:id', authController.postRevokeToken);

module.exports = router;
