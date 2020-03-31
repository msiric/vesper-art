const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const emailController = require('../../../controllers/emailController');

router.route('/send_email').post(emailController.sendConfirmation);

router.route('/verify/:token').get(emailController.verifyToken);

// treba sredit ?
router.route('/forgot').get(function(req, res) {
  if (!req.user) {
    res.json({
      user: req.user
    });
  } else {
    res.redirect('/');
  }
});

router.route('/forgot').post(emailController.forgotPassword);

router.route('/reset/:token').get(emailController.getToken);

router.route('/reset/:token').post(emailController.resendToken);

module.exports = router;
