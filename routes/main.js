const router = require('express').Router();
const async = require('async');
const Gig = require('../models/gig');
const User = require('../models/user');
const Promocode = require('../models/promocode');

const algoliasearch = require('algoliasearch');
let client = algoliasearch('P9R2R1LI94', '2b949398099e9ee44619187ca4ea9809');
let index = client.initIndex('GigSchema');

const fee = 3.15;

router.get('/', (req, res) => {
  Gig.find({}, function(err, gigs) {
    res.render('main/home', { gigs: gigs });
  });
});

router
  .route('/search')
  .get((req, res, next) => {
    if (req.query.q) {
      index.search(req.query.q, function(err, content) {
        res.render('main/search_results', {
          content: content,
          search_results: req.query.q
        });
      });
    }
  })
  .post((req, res, next) => {
    res.redirect('/search/?q=' + req.body.search_input);
  });

router.get('/my-gigs', (req, res, next) => {
  Gig.find({ owner: req.user._id }, function(err, gigs) {
    res.render('main/my-gigs', { gigs: gigs });
  });
});

router
  .route('/add-new-gig')
  .get((req, res, next) => {
    res.render('main/add-new-gig');
  })
  .post((req, res, next) => {
    async.waterfall([
      function(callback) {
        let gig = new Gig();
        gig.owner = req.user._id;
        gig.title = req.body.gig_title;
        gig.category = req.body.gig_category;
        gig.about = req.body.gig_about;
        gig.price = req.body.gig_price;
        gig.save(function(err) {
          callback(err, gig);
        });
      },

      function(gig, callback) {
        User.update(
          {
            _id: req.user._id
          },
          {
            $push: { gigs: gig._id }
          },
          function(err, count) {
            res.redirect('/my-gigs');
          }
        );
      }
    ]);
  });

router.get('/service_detail/:id', (req, res, next) => {
  let gigId = req.params.id;
  Gig.findOne({ _id: req.params.id })
    .populate('owner')
    .exec(function(err, gig) {
      let inCart = false;
      if (req.user) {
        if (req.user.cart.indexOf(gigId) > -1) {
          inCart = true;
        }
      }
      res.render('main/service_detail', { gig: gig, inCart: inCart });
    });
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
          if (user.promos.length > 0) {
            res.json({ warningUsed: 'You already used a promo code' });
          } else {
            User.update(
              { _id: req.user._id },
              {
                $push: {
                  promos: foundCode._id
                }
              },
              function(err, count) {
                let discount = foundCode.discount * 100;
                let promo = foundCode._id;
                subtotal = (totalPrice - fee) * (1 - foundCode.discount);
                totalPrice = subtotal + fee;
                req.session.price = totalPrice;
                req.session.discount = true;
                res.json({ totalPrice, subtotal, discount, promo });
              }
            );
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
          req.session.discount = false;
          res.json({ totalPrice, subtotal });
        }
      );
    }
  ]);
});

module.exports = router;
