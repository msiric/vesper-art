const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const emailController = require('../../../controllers/emailController');

router.post('/send_email', emailController.sendConfirmation);

router.get('/verify/:token', emailController.verifyToken);

router.get('/forgot', function(req, res) {
  if (!req.user) {
    res.json({
      user: req.user
    });
  } else {
    res.redirect('/');
  }
});

router.post('/forgot', emailController.forgotPassword);

router.get('/reset/:token', emailController.getToken);

router.post('/reset/:token', emailController.resendToken);

module.exports = router;
