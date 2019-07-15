const router = require('express').Router();
const { isLoggedInAPI, isLoggedOut } = require('../../utils/helpers');
const userController = require('../../controllers/userController');

router
  .route('/signup')
  .get((req, res, next) => {
    res.render('accounts/signup');
  })
  .post(userController.postSignUp);

router
  .route('/login')
  .get((req, res, next) => {
    if (req.user) return res.redirect('/');
    res.render('accounts/login');
  })
  .post(
    passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/auth/google', passport.authenticate('google', { scope: 'email' }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router
  .route('/profile')
  .get(passportConfig.isAuthenticated, (req, res, next) => {
    if (req.user) {
      res.render('accounts/profile', { message: req.flash('success') });
    } else {
      res.redirect('/login');
    }
  })
  .post((req, res, next) => {
    User.findOne({ _id: req.user._id }, function(err, user) {
      if (user) {
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.about) user.about = req.body.about;
        user.save(function(err) {
          req.flash('success', 'Your details have been updated');
          res.redirect('/profile');
        });
      }
    });
  });

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});

router.get('/settings', function(req, res) {
  if (req.user) {
    res.render('accounts/settings', {
      error: req.flash('error'),
      success: req.flash('success'),
      customWork: req.user.customWork
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/new-password', (req, res, next) => {
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (user) {
      let current = req.body.current;
      let change = req.body.password;
      let confirm = req.body.confirm;
      console.log(current, change, confirm);
      if (current && change && confirm) {
        if (user.comparePassword(current)) {
          if (change === confirm) {
            user.password = change;
            user.save(function(err) {
              req.flash('success', 'Your details have been updated');
              res.render('accounts/settings', {
                success: req.flash('success')
              });
            });
          } else {
            req.flash('error', 'New passwords do not match');
            res.render('accounts/settings', { error: req.flash('error') });
          }
        } else {
          req.flash('error', 'Current password incorrect');
          res.render('accounts/settings', { error: req.flash('error') });
        }
      } else {
        req.flash('error', 'Please fill all the fields');
        res.render('accounts/settings', { error: req.flash('error') });
      }
    } else {
      req.flash('error', 'User not found');
      res.redirect('/');
    }
  });
});

router.post('/update-preferences', (req, res, next) => {
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (user) {
      let customWork = req.body.work;
      console.log(customWork);
      if (customWork) {
        user.customWork = true;
      } else {
        user.customWork = false;
      }
      user.save(function(err) {
        req.flash('success', 'Your details have been updated');
        res.render('accounts/settings');
      });
    } else {
      req.flash('error', 'User not found');
      res.redirect('/', { error: req.flash('error') });
    }
  });
});

module.exports = router;
