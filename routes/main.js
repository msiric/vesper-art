const router = require('express').Router();
const async = require('async');
const Artwork = require('../models/artwork');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const Promocode = require('../models/promocode');
const Notification = require('../models/notification');
const Request = require('../models/request');

const algoliasearch = require('algoliasearch');
let client = algoliasearch('P9R2R1LI94', '2b949398099e9ee44619187ca4ea9809');
let index = client.initIndex('ArtworkSchema');

const fee = 3.15;

router.get('/', (req, res) => {
  async.series(
    [
      function(callback) {
        Request.find({})
          .populate('poster')
          .exec(function(err, requests) {
            if (err) console.log(err);
            callback(err, requests);
          });
      },
      function(callback) {
        Artwork.find({}, function(err, artwork) {
          callback(err, artwork);
        });
      }
    ],
    function(err, results) {
      res.render('main/home', {
        requests: results[0],
        artwork: results[1]
      });
    }
  );
});

router.get('/categories/creative-writing', (req, res) => {
  Artwork.find({ category: 'cw' }, function(err, artwork) {
    res.render('main/creative-writing', { artwork: artwork });
  });
});

router.get('/categories/music', (req, res) => {
  Artwork.find({ category: 'm' }, function(err, artwork) {
    res.render('main/music', { artwork: artwork });
  });
});

router.get('/categories/visual-arts', (req, res) => {
  Artwork.find({ category: 'va' }, function(err, artwork) {
    res.render('main/visual-arts', { artwork: artwork });
  });
});

router
  .route('/search')
  .get((req, res, next) => {
    if (req.query.q) {
      index.search(req.query.q, function(err, content) {
        res.render('main/search-results', {
          content: content,
          searchResults: req.query.q
        });
      });
    }
  })
  .post((req, res, next) => {
    if (req.body.search_input.trim()) {
      res.redirect('/search/?q=' + req.body.search_input);
    } else {
      req.flash('error', 'Search cannot be empty');
      res.redirect('/');
    }
  });

router.get('/api/add-promocode', (req, res, next) => {
  let promocode = new Promocode();
  promocode.name = 'testcoupon';
  promocode.discount = 0.4;
  promocode.save(function(err) {
    res.json('Successful');
  });
});

router.post('/promocode', (req, res, next) => {
  let promocode = req.body.promocode;
  let totalPrice = req.session.price;
  let subtotal = totalPrice - fee;
  if (!req.session.discount) {
    Promocode.findOne({ name: promocode }, function(err, foundCode) {
      if (foundCode) {
        User.findOne({ _id: req.user._id }, function(err, user) {
          if (req.session.discount) {
            res.json({ warningUsed: 'You already used a promo code' });
          } else {
            let discount = foundCode.discount * 100;
            let promo = foundCode._id;
            subtotal = (totalPrice - fee) * (1 - foundCode.discount);
            totalPrice = subtotal + fee;
            req.session.price = totalPrice;
            req.session.discount = foundCode._id;
            res.json({ totalPrice, subtotal, discount, promo });
          }
        });
      } else {
        res.json({ warningUnfound: 'Promo code does not exist' });
      }
    });
  } else {
    res.json({ warningMulti: 'You already have an active promo code' });
  }
});

router.post('/remove-promocode', (req, res, next) => {
  let promocode = req.body.promocode;
  let totalPrice = req.session.price;
  let subtotal = totalPrice - fee;
  async.waterfall([
    function(callback) {
      Promocode.findOne({ _id: promocode }, function(err, promo) {
        callback(err, promo);
      });
    },
    function(promo, callback) {
      User.update(
        {
          _id: req.user._id
        },
        {
          $pull: { promos: promo._id }
        },
        function(err, user) {
          let discount = promo.discount;
          subtotal = totalPrice - fee;
          subtotal = subtotal / (1 - discount);
          totalPrice = subtotal + fee;
          req.session.price = totalPrice;
          req.session.discount = null;
          res.json({ totalPrice, subtotal });
        }
      );
    }
  ]);
});

router.get('/notifications', (req, res, next) => {
  if (req.user) {
    Notification.find({ receiver: req.user._id })
      .populate('sender')
      .exec(function(err, notifications) {
        res.render('accounts/notifications', { notifications: notifications });
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/', (req, res) => {
  async.series(
    [
      function(callback) {
        Request.find({}, function(err, requests) {
          if (err) console.log(err);
          callback(err, requests);
        });
      },
      function(callback) {
        Artwork.find({}, function(err, artwork) {
          callback(err, artwork);
        });
      }
    ],
    function(err, results) {
      res.render('main/home', { requests: results[0], artwork: results[1] });
    }
  );
});

module.exports = router;
