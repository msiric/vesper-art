const router = require('express').Router();
const stripe = require('stripe')('sk_test_gBneokmqdbgLUsAQcHZuR4h500k4P1wiBq');
const Gig = require('../models/gig');
const Order = require('../models/order');

const fee = 3.15;

router.get('/checkout/single_package/:id', (req, res, next) => {
  Gig.findOne({ _id: req.params.id }, function(err, gig) {
    let totalPrice = gig.price + fee;
    req.session.gig = gig;
    req.session.price = totalPrice;
    res.render('checkout/single_package', { gig: gig, totalPrice: totalPrice });
  });
});

router
  .route('/payment')
  .get((req, res, next) => {
    res.render('checkout/payment');
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
          req.session.gig = null;
          req.session.price = null;
          res.redirect('/users/' + req.user._id + '/orders/' + order._id);
        });
      })
      .catch(err => {
        // Deal with an error
      });
  });

router.get('/users/:userId/orders/:orderId', (req, res, next) => {
  req.session.orderId = req.params.orderId;
  Order.findOne({ _id: req.params.orderId })
    .populate('buyer')
    .populate('seller')
    .populate('gig')
    .exec(function(err, order) {
      res.render('order/order-room', { layout: 'chat_layout', order: order });
    });
});

router.get('/users/:id/manage_orders', (req, res, next) => {
  Order.find({ seller: req.user._id })
    .populate('buyer')
    .populate('seller')
    .populate('gig')
    .exec(function(err, order) {
      res.render('order/order-seller', { order: order });
    });
});

router.get('/users/:id/orders', (req, res, next) => {
  Order.find({ buyer: req.user._id })
    .populate('buyer')
    .populate('seller')
    .populate('gig')
    .exec(function(err, order) {
      res.render('order/order-buyer', { order: order });
    });
});

module.exports = router;
