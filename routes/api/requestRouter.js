const router = require('express').Router();
const async = require('async');
const User = require('../../models/user');
const Offer = require('../../models/Offer');
const Request = require('../../models/request');

router.post('/request', (req, res, next) => {
  if (req.user) {
    async.waterfall([
      function(callback) {
        User.findOne({ _id: req.user._id }, function(err, user) {
          if (user.requests && user.requests.length > 0) {
            req.flash('error', 'You already have an active request');
            res.redirect('/');
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
    res.redirect('/');
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
            res.redirect('/');
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
    res.redirect('/');
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
            res.redirect('/');
          }
        });
      },
      function(user, callback) {
        Request.findOne({ _id: requestId }, function(err, request) {
          if (request) {
            res.render('main/edit-request', { request: request });
          } else {
            req.flash('error', 'Request not found');
            res.redirect('/');
          }
        });
      }
    ]);
  } else {
    req.flash('error', 'You need to be logged in');
    res.redirect('/');
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
            res.redirect('/');
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
            res.redirect('/');
          }
        });
      }
    ]);
  } else {
    req.flash('error', 'You need to be logged in');
    res.redirect('/');
  }
});

router.get('/users/:id/requests', (req, res, next) => {
  Request.find({ poster: req.user._id })
    .populate('poster')
    .exec(function(err, request) {
      res.render('request/requests', {
        request: request
      });
    });
});

router.get('/users/:userId/requests/:requestId', (req, res, next) => {
  async.waterfall([
    function(callback) {
      Request.findOne({ _id: req.params.requestId })
        .deepPopulate(['offers.buyer', 'offers.seller'])
        .exec(function(err, request) {
          if (err) console.log(err);
          callback(err, request);
        });
    },
    function(request, err) {
      const offers = [];
      if (request.offers) {
        request.offers.forEach(function(offer) {
          Offer.findOne({ seller: offer.seller })
            .populate('buyer')
            .populate('seller')
            .exec(function(err, offer) {
              if (err) console.log(err);
              offers.push(offer);
            });
        });
      }
      res.render('request/request-details', {
        request: request,
        offers: offers
      });
    }
  ]);
});

router.get('/users/:id/offers', (req, res, next) => {
  Offer.find({ seller: req.user._id })
    .populate('buyer')
    .exec(function(err, offer) {
      res.render('offer/offers', {
        offer: offer
      });
    });
});

router.get('/users/:userId/offers/:offerId', (req, res, next) => {
  async.waterfall([
    function(callback) {
      Offer.findOne({ _id: req.params.offerId })
        .populate('buyer')
        .populate('seller')
        .exec(function(err, offer) {
          if (err) console.log(err);
          callback(err, offer);
        });
    },
    function(offer, err) {
      Request.findOne({ poster: offer.buyer })
        .populate('poster')
        .exec(function(err, request) {
          if (err) console.log(err);
          res.render('offer/offer-details', {
            offer: offer,
            request: request
          });
        });
    }
  ]);
});

module.exports = router;
