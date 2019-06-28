const router = require('express').Router();
const async = require('async');
const Artwork = require('../models/artwork');
const User = require('../models/user');
const Promocode = require('../models/promocode');

const algoliasearch = require('algoliasearch');
let client = algoliasearch('P9R2R1LI94', '2b949398099e9ee44619187ca4ea9809');
let index = client.initIndex('ArtworkSchema');

const fee = 3.15;

router.get('/', (req, res) => {
  Artwork.find({}, function(err, artwork) {
    res.render('main/home', { artwork: artwork });
  });
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

router.get('/my-artwork', (req, res, next) => {
  Artwork.find({ owner: req.user._id }, function(err, artwork) {
    res.render('main/my-artwork', { artwork: artwork });
  });
});

router
  .route('/add-new-artwork')
  .get((req, res, next) => {
    res.render('main/add-new-artwork');
  })
  .post((req, res, next) => {
    async.waterfall([
      function(callback) {
        let artwork = new Artwork();
        artwork.owner = req.user._id;
        artwork.title = req.body.artwork_title;
        artwork.category = req.body.artwork_category;
        artwork.about = req.body.artwork_about;
        artwork.price = req.body.artwork_price;
        artwork.save(function(err) {
          callback(err, artwork);
        });
      },

      function(artwork, callback) {
        User.update(
          {
            _id: req.user._id
          },
          {
            $push: { artwork: artwork._id }
          },
          function(err, count) {
            res.redirect('/my-artwork');
          }
        );
      }
    ]);
  });

router.get('/artwork_details/:id', (req, res, next) => {
  let artwork_id = req.params.id;
  Artwork.findOne({ _id: req.params.id })
    .populate('owner')
    .exec(function(err, artwork) {
      let inCart = false;
      if (req.user) {
        if (req.user.cart.indexOf(artwork_id) > -1) {
          inCart = true;
        }
      }
      res.render('main/artwork_details', { artwork: artwork, inCart: inCart });
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
