const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../config/passport');
const User = require('../models/user');
const randomString = require('randomstring');
const axios = require('axios');

/* SIGNUP ROUTE */

router
  .route('/signup')
  .get((req, res, next) => {
    res.render('accounts/signup', {
      error: req.flash('error'),
      success: req.flash('success')
    });
  })

  .post((req, res, next) => {
    User.findOne({ email: req.body.email }, function(err, user) {
      if (user) {
        req.flash('error', 'Account with that email address already exists.');
        return res.redirect('/signup');
      } else {
        let verificationInfo = {
          token: randomString.generate(),
          email: req.body.email
        };
        let user = new User();
        user.name = req.body.username;
        user.email = req.body.email;
        user.photo = user.gravatar();
        user.password = req.body.password;
        user.customWork = true;
        user.secretToken = verificationInfo.token;
        user.verified = false;
        user.save(function(err) {
          if (err) return next(err);
          axios
            .post('http://localhost:3000/send-email', verificationInfo, {
              proxy: false
            })
            .then(res => {
              console.log(`statusCode: ${res.statusCode}`);
              console.log(res);
            })
            .catch(error => {
              console.error(error);
            });
          req.flash('success', 'Account created successfully.');
          res.redirect('/login');
        });
      }
    });
  });

/* LOGIN ROUTE */
router
  .route('/login')
  .get((req, res, next) => {
    if (req.user) return res.redirect('/');
    res.render('accounts/login', {
      error: req.flash('error'),
      success: req.flash('success')
    });
  })
  .post(
    passport.authenticate('local-login', {
      successRedirect: '/', // redirect to the secure profile section
      failureRedirect: '/login', // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
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

/* PROFILE ROUTE */
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
      success: req.flash('success')
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
      if (current && change && confirm) {
        if (current === user.password) {
          if (change === confirm) {
            user.password = change;
            user.save(function(err) {
              req.flash('success', 'Your details have been updated');
              res.redirect('/settings');
            });
          } else {
            req.flash(
              'error',
              'New password does not match with the confirmation'
            );
            res.redirect('/settings');
          }
        } else {
          req.flash('error', 'Current password does not match');
          res.redirect('/settings');
        }
      } else {
        req.flash('error', 'Please fill all the fields');
        res.redirect('/settings');
      }
    } else {
      req.flash('error', 'User not found');
      res.redirect('/');
    }
  });
});

module.exports = router;
