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

// TEST

router.route('/revoke_token/:userId').post(authController.postRevokeToken);

router.route('/send_email').post(authController.sendConfirmation);

router.route('/verify/:tokenId').get(authController.verifyToken);

router.route('/forgot').get(function (req, res) {
  if (!req.user) {
    res.json({
      user: req.user,
    });
  } else {
    res.redirect('/');
  }
});

router.route('/forgot').post(authController.forgotPassword);

router.route('/reset/:tokenId').get(authController.getToken);

router.route('/reset/:tokenId').post(authController.resendToken);

module.exports = router;
