const router = require('express').Router();
const async = require('async');
const stripe = require('stripe')('sk_test_gBneokmqdbgLUsAQcHZuR4h500k4P1wiBq');
const Artwork = require('../models/artwork');
const Order = require('../models/order');
const Promocode = require('../models/promocode');
const User = require('../models/user');

const fee = 3.15;

router.get('/checkout/single_package/:id', (req, res, next) => {
  let artworkInfo = {
    totalPrice: 0,
    subtotal: 0,
    discount: null,
    promo: null,
    artwork: null
  };
  async.waterfall(
    [
      function(callback) {
        if (req.user) {
          Artwork.findOne({ _id: req.params.id }).exec(function(err, artwork) {
            artworkInfo.artwork = artwork;
            artworkInfo.totalPrice = artwork.price + fee;
            artworkInfo.subtotal = artwork.price;
            callback(err, artwork);
          });
        }
      },
      function(artwork, callback) {
        User.findOne({ _id: req.user._id }, function(err, user) {
          callback(err, user);
        });
      },
      function(user, callback) {
        if (user.promos.length > 0) {
          Promocode.findOne({ _id: user.promos[0] }, function(err, promo) {
            artworkInfo.subtotal =
              artworkInfo.artwork.price * (1 - promo.discount);
            artworkInfo.discount = promo.discount * 100;
            artworkInfo.totalPrice =
              artworkInfo.artwork.price * (1 - promo.discount) + fee;
            artworkInfo.promo = promo._id;
            callback(err, artworkInfo);
          });
        } else {
          callback(null, artworkInfo);
        }
      }
    ],
    function(err, result) {
      req.session.artwork = result.artwork;
      req.session.price = result.totalPrice;
      res.render('checkout/single_package', {
        artwork: result.artwork,
        subtotal: parseFloat(result.subtotal.toFixed(12)),
        totalPrice: parseFloat(result.totalPrice.toFixed(12)),
        discount: result.discount,
        promo: result.promo
      });
    }
  );
});

router.get('/checkout/process_cart', (req, res, next) => {
  let artworkInfo = {
    price: 0,
    cartIsEmpty: true,
    totalPrice: 0,
    subtotal: 0,
    foundUser: null,
    discount: null,
    promo: null,
    artwork: null
  };
  async.waterfall(
    [
      function(callback) {
        User.findOne({ _id: req.user._id })
          .populate('cart')
          .exec(function(err, user) {
            if (user.cart.length > 0) {
              artworkInfo.foundUser = user;
              user.cart.map(function(item) {
                artworkInfo.price += item.price;
              });
              artworkInfo.subtotal = artworkInfo.price;
              artworkInfo.totalPrice = artworkInfo.price + fee;
            } else {
              artworkInfo.cartIsEmpty = false;
            }
            callback(err, user);
          });
      },
      function(user, callback) {
        if (user.promos.length > 0) {
          Promocode.findOne({ _id: user.promos[0] }, function(err, promo) {
            artworkInfo.subtotal = artworkInfo.price * (1 - promo.discount);
            artworkInfo.discount = promo.discount * 100;
            artworkInfo.totalPrice = artworkInfo.subtotal + fee;
            artworkInfo.promo = promo._id;
            callback(err, artworkInfo);
          });
        } else {
          callback(null, artworkInfo);
        }
      }
    ],
    function(err, result) {
      req.session.price = result.totalPrice;
      if (result.foundUser) {
        req.session.artwork = result.foundUser.cart;
      } else {
        req.session.artwork = null;
      }
      res.render('order/cart', {
        foundUser: result.foundUser,
        totalPrice: parseFloat(result.totalPrice.toFixed(12)),
        subtotal: parseFloat(result.subtotal.toFixed(12)),
        cartIsEmpty: result.cartIsEmpty,
        discount: result.discount,
        promo: result.promo
      });
    }
  );
});

router
  .route('/payment')
  .get((req, res, next) => {
    res.render('checkout/payment', {
      amount: parseFloat(req.session.price.toFixed(12))
    });
  })
  .post((req, res, next) => {
    let artwork = req.session.artwork;
    let price = req.session.price;
    price *= 100;
    stripe.customers
      .create({
        email: req.user.email
      })
      .then(customer => {
        return stripe.customers.createSource(customer.id, {
          source: req.body.stripeToken
        });
      })
      .then(source => {
        return stripe.charges.create({
          amount: price,
          currency: 'usd',
          customer: source.customer
        });
      })
      .then(charge => {
        // New charge created on a new customer
        let order = new Order();
        order.buyer = req.user._id;
        order.seller = artwork.owner;
        order.artwork = artwork._id;
        order.save(function(err) {
          if (err) console.log(err);
          req.session.artwork = null;
          req.session.price = null;
          res.redirect('/users/' + req.user._id + '/orders/' + order._id);
        });
      })
      .catch(err => {
        // Deal with an error
      });
  });

router
  .route('/payment/cart')
  .get((req, res, next) => {
    res.render('checkout/payment', {
      amount: parseFloat(req.session.price.toFixed(12))
    });
  })
  .post((req, res, next) => {
    let artworks = req.session.artwork;
    let price = req.session.price;
    price *= 100;
    price = Math.round(price);
    stripe.customers
      .create({
        email: req.user.email
      })
      .then(customer => {
        return stripe.customers.createSource(customer.id, {
          source: req.body.stripeToken
        });
      })
      .then(source => {
        return stripe.charges.create({
          amount: price,
          currency: 'usd',
          customer: source.customer
        });
      })
      .then(function(charge) {
        // New charge created on a new customer
        artworks.map(function(artwork) {
          let order = new Order();
          order.buyer = req.user._id;
          order.seller = artwork.owner;
          order.artwork = artwork._id;
          order.save(function(err) {
            req.session.artwork = null;
            req.session.price = null;
          });
        });
        User.update({ _id: req.user._id }, { $set: { cart: [] } }, function(
          err,
          updated
        ) {
          if (updated) {
            res.redirect('/users/' + req.user._id + '/orders');
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  });

router.get('/users/:userId/orders/:orderId', (req, res, next) => {
  req.session.orderId = req.params.orderId;
  Order.findOne({ _id: req.params.orderId })
    .populate('buyer')
    .populate('seller')
    .populate('artwork')
    .deepPopulate('messages.owner')
    .exec(function(err, order) {
      res.render('order/order-room', {
        layout: 'chat_layout',
        order: order,
        helpers: {
          if_equals: function(a, b, opts) {
            if (a.equals(b)) {
              return opts.fn(this);
            } else {
              return opts.inverse(this);
            }
          }
        }
      });
    });
});

router.get('/users/:id/manage_orders', (req, res, next) => {
  Order.find({ seller: req.user._id })
    .populate('buyer')
    .populate('seller')
    .populate('artwork')
    .exec(function(err, order) {
      res.render('order/order-seller', {
        order: order
      });
    });
});

router.get('/users/:id/orders', (req, res, next) => {
  Order.find({ buyer: req.user._id })
    .populate('buyer')
    .populate('seller')
    .populate('artwork')
    .exec(function(err, order) {
      res.render('order/order-buyer', {
        order: order
      });
    });
});

router.post('/add-to-cart', (req, res, next) => {
  const artworkId = req.body.artwork_id;
  if (req.user.cart.indexOf(artworkId) > -1) {
    res.json({ warning: 'Item already in cart' });
    return false;
  } else {
    User.update(
      {
        _id: req.user._id
      },
      {
        $push: { cart: artworkId }
      },
      function(err, count) {
        res.json({ message: 'Added to cart' });
      }
    );
  }
});

router.post('/remove-from-cart', (req, res, next) => {
  const artworkId = req.body.artwork_id;
  async.waterfall([
    function(callback) {
      artwork.findOne({ _id: artworkId }, function(err, artwork) {
        callback(err, artwork);
      });
    },
    function(artwork, callback) {
      User.update(
        {
          _id: req.user._id
        },
        {
          $pull: { cart: artworkId }
        },
        function(err, count) {
          let totalPrice = req.session.price - artwork.price;
          res.json({
            totalPrice: parseFloat(totalPrice.toFixed(12)),
            price: artwork.price,
            message: 'Removed from cart'
          });
        }
      );
    }
  ]);
});

module.exports = router;
