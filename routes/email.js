const router = require('express').Router();
const nodemailer = require('nodemailer');
const config = require('../config/mailer');
const User = require('../models/user');
const crypto = require('crypto');
const async = require('async');

router.post('/send-email', (req, res) => {
  var mailOptions, host, link;
  console.log('wut');
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.email,
      pass: config.password
    }
  });
  host = req.get('host');
  console.log(req.body);
  recipient = req.body.email;
  token = req.body.token;
  if (recipient && token) {
    link = 'http://' + req.get('host') + '/verify/' + token;
    mailOptions = {
      from: 'vesper',
      to: recipient,
      subject: 'Please confirm your e-mail',
      html:
        'Hello,<br>Please click on the link to verify your email.<br><a href=' +
        link +
        '>Click here to verify</a>'
    };
    smtpTransport.sendMail(mailOptions, function(error, response) {
      if (error) {
        req.flash('error', "E-mail couldn't be sent. Please try again.");
        res.render('accounts/login', {
          error: req.flash('error')
        });
      } else {
        req.flash(
          'success',
          'Message has been sent. Please check your e-mail.'
        );
        res.render('accounts/login', {
          success: req.flash('success')
        });
      }
    });
  } else {
    req.flash('error', 'Something went wrong. Please try again.');
    res.render('accounts/login', {
      error: req.flash('error')
    });
  }
});

router.get('/verify/:token', (req, res, next) => {
  User.findOne({ secretToken: req.params.token }, function(err, user) {
    if (user) {
      user.secretToken = null;
      user.verified = true;
      user.save(function(err) {
        req.flash('success', 'Thank you for verifying your account.');
        res.render('accounts/signup', {
          success: req.flash('success')
        });
      });
    } else {
      req.flash('error', 'Verification token could not be found.');
      res.render('accounts/signup', {
        error: req.flash('error')
      });
    }
  });
});

router.get('/forgot', function(req, res) {
  if (!req.user) {
    res.render('accounts/forgot', {
      user: req.user
    });
  } else {
    res.redirect('/');
  }
});

router.post('/forgot', function(req, res, next) {
  async.waterfall(
    [
      function(callback) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          callback(err, token);
        });
      },
      function(token, callback) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            res.render('accounts/login', {
              error: req.flash('error')
            });
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            callback(err, token, user);
          });
        });
      },
      function(token, user, callback) {
        const smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: config.email,
            pass: config.password
          }
        });
        mailOptions = {
          from: 'vesper',
          to: user.email,
          subject: 'Reset your password',
          html:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.<br>' +
            'Please click on the following link, or paste this into your browser to complete the process:<br><br>' +
            '<a href="http://' +
            req.headers.host +
            '/reset/' +
            token +
            '"</a><br>' +
            'If you did not request this, please ignore this email and your password will remain unchanged.'
        };
        smtpTransport.sendMail(mailOptions, function(error, response) {
          if (error) {
            console.log(error);
            req.flash('error', 'Something went wrong. Please try again.');
            res.render('accounts/login', {
              error: req.flash('error')
            });
          } else {
            req.flash(
              'success',
              'An e-mail has been sent to ' +
                user.email +
                ' with further instructions.'
            );
            res.render('accounts/login', {
              success: req.flash('success')
            });
          }
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    }
  );
});

router.get('/reset/:token', function(req, res) {
  if (!req.user) {
    User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      },
      function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          res.render('accounts/forgot', {
            error: req.flash('error')
          });
        }
        res.render('accounts/reset', {
          user: req.user
        });
      }
    );
  } else {
    res.redirect('/');
  }
});

router.post('/reset/:token', function(req, res) {
  console.log(req.body);
  async.waterfall(
    [
      function(callback) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function(err, user) {
            if (!user) {
              req.flash(
                'error',
                'Password reset token is invalid or has expired.'
              );
              res.render('accounts/login', {
                error: req.flash('error')
              });
            } else if (req.body.password !== req.body.confirm) {
              req.flash('error', 'Passwords do not match.');
              res.render('accounts/login', {
                error: req.flash('error')
              });
            } else if (user.password === req.body.password) {
              req.flash('error', 'Password is identical to the old one.');
              res.render('/login', {
                error: req.flash('error')
              });
            } else {
              user.password = req.body.password;
              user.resetPasswordToken = null;
              user.resetPasswordExpires = null;

              user.save(function(err) {
                req.logIn(user, function(err) {
                  callback(err, user);
                });
              });
            }
          }
        );
      },
      function(user, callback) {
        const smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: config.email,
            pass: config.password
          }
        });
        mailOptions = {
          from: 'vesper',
          to: user.email,
          subject: 'Password change',
          html:
            'You are receiving this because you just changed your password <br><br> If you did not request this, please contact us immediately.'
        };
        smtpTransport.sendMail(mailOptions, function(error, response) {
          if (error) {
            console.log(error);
            req.flash('error', 'Something went wrong. Please try again.');
            res.render('accounts/login', {
              error: req.flash('error')
            });
          } else {
            req.flash('success', 'Success! Your password has been changed.');
            res.redirect('/login');
          }
        });
      }
    ],
    function(err) {
      res.redirect('/');
    }
  );
});

module.exports = router;
