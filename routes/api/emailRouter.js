const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const emailController = require('../../controllers/emailController');

router.post('/send-email', emailController.sendEmail);

router.get('/verify/:token', emailController.verifyToken);

router.get('/forgot', function(req, res) {
  if (!req.user) {
    res.render('accounts/forgot', {
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
