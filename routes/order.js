const router = require('express').Router();
const async = require('async');
const stripe = require('stripe')('sk_test_gBneokmqdbgLUsAQcHZuR4h500k4P1wiBq');
const Gig = require('../models/gig');
const Order = require('../models/order');
const Promocode = require('../models/promocode');
const User = require('../models/user');

const fee = 3.15;

router.get('/checkout/single_package/:id', (req, res, next) => {
  let gigInfo = {
    totalPrice: req.session.price,
    subtotal: this.totalPrice - fee,
    discount: null,
    promo: null,
    gig: null
  };
  async.waterfall(
    [
      function(callback) {
        if (req.user) {
          Gig.findOne({ _id: req.params.id }).exec(function(err, gig) {
            gigInfo.gig = gig;
            gigInfo.totalPrice = gig.price + fee;
            gigInfo.subtotal = gig.price;
            callback(err, gig);
          });
        }
      },
      function(gig, callback) {
        User.findOne({ _id: req.user._id }, function(err, user) {
          callback(err, user);
        });
      },
      function(user, callback) {
        if (user.promos.length > 0) {
          Promocode.findOne({ _id: user.promos[0] }, function(err, promo) {
            gigInfo.subtotal = gigInfo.gig.price * (1 - promo.discount);
            gigInfo.discount = promo.discount * 100;
            gigInfo.totalPrice = gigInfo.gig.price * (1 - promo.discount) + fee;
            gigInfo.promo = promo._id;
            callback(err, gigInfo);
          });
        } else {
          callback(null, gigInfo);
        }
      }
    ],
    function(err, result) {
      req.session.gig = result.gig;
      req.session.price = result.totalPrice;
      res.render('checkout/single_package', {
        gig: result.gig,
        subtotal: parseFloat(result.subtotal.toFixed(12)),
        totalPrice: parseFloat(result.totalPrice.toFixed(12)),
        discount: result.discount,
        promo: result.promo
      });
    }
  );
});

router.get('/checkout/process_cart', (req, res, next) => {
  let gigInfo = {
    price: 0,
    cartIsEmpty: true,
    totalPrice: req.session.price,
    subtotal: this.totalPrice - fee,
    foundUser: null,
    discount: null,
    promo: null,
    gig: null
  };
  async.waterfall(
    [
      function(callback) {
        User.findOne({ _id: req.user._id })
          .populate('cart')
          .exec(function(err, user) {
            if (user.cart.length > 0) {
              gigInfo.foundUser = user;
              user.cart.map(function(item) {
                gigInfo.price += item.price;
              });
              gigInfo.subtotal = gigInfo.price;
              gigInfo.totalPrice = gigInfo.price + fee;
            } else {
              gigInfo.cartIsEmpty = false;
            }
            callback(err, user);
          });
      },
      function(user, callback) {
        if (user.promos.length > 0) {
          Promocode.findOne({ _id: user.promos[0] }, function(err, promo) {
            gigInfo.subtotal = gigInfo.price * (1 - promo.discount);
            gigInfo.discount = promo.discount * 100;
            gigInfo.totalPrice = gigInfo.subtotal + fee;
            gigInfo.promo = promo._id;
            callback(err, gigInfo);
          });
        } else {
          callback(null, gigInfo);
        }
      }
    ],
    function(err, result) {
      req.session.price = result.totalPrice;
      if (result.foundUser) {
        req.session.gig = result.foundUser.cart;
      } else {
        req.session.gig = null;
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
    res.render('checkout/payment', { amount: req.session.price });
  })
  .post((req, res, next) => {
    let gig = req.session.gig;
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
        order.seller = gig.owner;
        order.gig = gig._id;
        order.save(function(err) {
          if (err) console.log(err);
          req.session.gig = null;
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
    res.render('checkout/payment', { amount: req.session.price });
  })
  .post((req, res, next) => {
    let gigs = req.session.gig;
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
        gigs.map(function(gig) {
          let order = new Order();
          order.buyer = req.user._id;
          order.seller = gig.owner;
          order.gig = gig._id;
          order.save(function(err) {
            req.session.gig = null;
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
    .populate('gig')
    .deepPopulate('messages.owner')
    .exec(function(err, order) {
      console.log(order);
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
    .populate('gig')
    .exec(function(err, order) {
      console.log(order);
      res.render('order/order-seller', { order: order });
    });
});

router.get('/users/:id/orders', (req, res, next) => {
  Order.find({ buyer: req.user._id })
    .populate('buyer')
    .populate('seller')
    .populate('gig')
    .exec(function(err, order) {
      console.log(order);
      res.render('order/order-buyer', { order: order });
    });
});

router.post('/add-to-cart', (req, res, next) => {
  const gigId = req.body.gig_id;
  if (req.user.cart.indexOf(gigId) > -1) {
    res.json({ warning: 'Item already in cart' });
    return false;
  } else {
    User.update(
      {
        _id: req.user._id
      },
      {
        $push: { cart: gigId }
      },
      function(err, count) {
        res.json({ message: 'Added to cart' });
      }
    );
  }
});

router.post('/remove-from-cart', (req, res, next) => {
  const gigId = req.body.gig_id;
  async.waterfall([
    function(callback) {
      Gig.findOne({ _id: gigId }, function(err, gig) {
        callback(err, gig);
      });
    },
    function(gig, callback) {
      User.update(
        {
          _id: req.user._id
        },
        {
          $pull: { cart: gigId }
        },
        function(err, count) {
          let totalPrice = req.session.price - gig.price;
          res.json({
            totalPrice: parseFloat(totalPrice.toFixed(12)),
            price: gig.price,
            message: 'Removed from cart'
          });
        }
      );
    }
  ]);
});

module.exports = router;
