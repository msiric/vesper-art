const router = require('express').Router();
const async = require('async');
const User = require('../models/user');
const Request = require('../models/request');

router.post('/request', (req, res, next) => {
  if (req.user) {
    async.waterfall([
      function(callback) {
        User.find({ _id: req.user._id }).exec(function(err, user) {
          if (user.requests) {
            req.flash('error', 'You already have an active request');
            res.render('main/home', { error: req.flash('error') });
          } else {
            let request = new Request();
            request.poster = req.user._id;
            if (req.body.request_category)
              request.category = req.body.request_category;
            if (req.body.request_budget)
              request.budget = req.body.request_budget;
            if (req.body.request_delivery)
              request.delivery = req.body.request_delivery;
            request.description = req.body.request_description;
            request.save(function(err) {
              if (err) console.log(err);
              callback(err, request);
            });
          }
        });
      },
      function(request, callback) {
        User.update(
          {
            _id: req.user._id
          },
          {
            $push: { requests: request._id }
          },
          function(err, result) {
            if (err) console.log(err);
            res.redirect('/');
          }
        );
      }
    ]);
  } else {
    req.flash('error', 'You need to be logged in');
    res.render('main/home', { error: req.flash('error') });
  }
});

router.delete('/request/:id', (req, res, next) => {
  if (req.user) {
    let requestId = req.params.id;
    async.waterfall([
      function(callback) {
        User.findOne({ _id: req.user._id }).exec(function(err, user) {
          if (user.requests.indexOf(requestId) > -1) {
            User.update(
              {
                _id: req.user._id
              },
              {
                $pull: { requests: requestId }
              },
              function(err, result) {
                if (err) console.log(err);
                callback(err, result);
              }
            );
          } else {
            req.flash('error', 'Request not found');
            res.render('main/home', { error: req.flash('error') });
          }
        });
      },
      function(result, callback) {
        Request.deleteOne({ _id: requestId }, function(err, result) {
          if (err) {
            req.flash('error', 'Something went wrong, please try again');
            res.render('main/home', { error: req.flash('error') });
          } else {
            res.end();
          }
        });
      }
    ]);
  } else {
    req.flash('error', 'You need to be logged in');
    res.render('main/home', { error: req.flash('error') });
  }
});

router.get('/edit-request/:id', (req, res, next) => {
  if (req.user) {
    let requestId = req.params.id;
    async.waterfall([
      function(callback) {
        User.findOne({ _id: req.user._id }).exec(function(err, user) {
          if (user.requests.indexOf(requestId) > -1) {
            callback(err, user);
          } else {
            req.flash('error', 'Request not found');
            res.render('main/home', { error: req.flash('error') });
          }
        });
      },
      function(user, callback) {
        Request.findOne({ _id: requestId }, function(err, request) {
          if (request) {
            res.render('main/edit-request', { request: request });
          } else {
            req.flash('error', 'Request not found');
            res.render('main/home', { error: req.flash('error') });
          }
        });
      }
    ]);
  } else {
    req.flash('error', 'You need to be logged in');
    res.render('main/home', { error: req.flash('error') });
  }
});

router.post('/edit-request/:id', (req, res, next) => {
  if (req.user) {
    let requestId = req.params.id;
    async.waterfall([
      function(callback) {
        User.findOne({ _id: req.user._id }).exec(function(err, user) {
          if (user.requests.indexOf(requestId) > -1) {
            callback(err, user);
          } else {
            req.flash('error', 'Request not found');
            res.render('main/home', { error: req.flash('error') });
          }
        });
      },
      function(user, callback) {
        Request.findOne({ _id: requestId }, function(err, request) {
          if (request) {
            if (req.body.request_category)
              request.category = req.body.request_category;
            if (req.body.request_budget)
              request.budget = req.body.request_budget;
            if (req.body.request_delivery)
              request.delivery = req.body.request_delivery;
            if (req.body.request_description) {
              request.description = req.body.request_description;
            }
            request.save(function(err) {
              req.flash('success', 'Your request has been updated');
              res.redirect('/');
            });
          } else {
            req.flash('error', 'Request not found');
            res.render('main/home', { error: req.flash('error') });
          }
        });
      }
    ]);
  } else {
    req.flash('error', 'You need to be logged in');
    res.render('main/home', { error: req.flash('error') });
  }
});

module.exports = router;
