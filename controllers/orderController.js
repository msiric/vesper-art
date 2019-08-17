const stripe = require('stripe')('sk_test_gBneokmqdbgLUsAQcHZuR4h500k4P1wiBq');
const Artwork = require('../models/artwork');
const Order = require('../models/order');
const Promocode = require('../models/promocode');
const User = require('../models/user');

const fee = 3.15;

const getSingleArtwork = async (req, res, next) => {
  try {
    let artworkInfo = {
      totalPrice: 0,
      subtotal: 0,
      discount: null,
      promo: null,
      artwork: null
    };
    const foundArtwork = await Artwork.findOne({ _id: req.params.id });
    if (foundArtwork) {
      artworkInfo.artwork = foundArtwork;
      artworkInfo.totalPrice = foundArtwork.price + fee;
      artworkInfo.subtotal = foundArtwork.price;

      const foundUser = await User.findOne({ _id: req.user._id });
      if (foundUser) {
        if (req.session.discount) {
          const foundPromocode = await Promocode.findOne({
            _id: req.session.discount
          });
          if (foundPromocode) {
            artworkInfo.subtotal =
              artworkInfo.artwork.price * (1 - foundPromocode.discount);
            artworkInfo.discount = foundPromocode.discount * 100;
            artworkInfo.totalPrice =
              artworkInfo.artwork.price * (1 - foundPromocode.discount) + fee;
            artworkInfo.promo = foundPromocode._id;
          } else {
            return res.status(400).json({ message: 'Promo code not found' });
          }
        }
        req.session.artwork = artworkInfo.artwork;
        req.session.price = artworkInfo.totalPrice;
        res.render('checkout/single-package', {
          artwork: artworkInfo.artwork,
          subtotal: parseFloat(artworkInfo.subtotal.toFixed(12)),
          totalPrice: parseFloat(artworkInfo.totalPrice.toFixed(12)),
          discount: artworkInfo.discount,
          promo: artworkInfo.promo
        });
      } else {
        return res.status(400).json({ message: 'User not found' });
      }
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getProcessCart = async (req, res, next) => {
  let artworkInfo = {
    price: 0,
    cartIsEmpty: false,
    totalPrice: 0,
    subtotal: 0,
    foundUser: null,
    discount: null,
    promo: null,
    artwork: null
  };

  const foundUser = await User.findOne({ _id: req.user._id }).populate('cart');
  try {
    if (foundUser) {
      if (foundUser.cart.length > 0) {
        artworkInfo.foundUser = foundUser;
        foundUser.cart.map(function(item) {
          artworkInfo.price += item.price;
        });
        artworkInfo.subtotal = artworkInfo.price;
        artworkInfo.totalPrice = artworkInfo.price + fee;
      } else {
        artworkInfo.cartIsEmpty = true;
      }
      if (req.session.discount) {
        const foundPromocode = await Promocode.findOne({
          _id: req.session.discount
        });
        if (foundPromocode) {
          artworkInfo.subtotal =
            artworkInfo.price * (1 - foundPromocode.discount);
          artworkInfo.discount = foundPromocode.discount * 100;
          artworkInfo.totalPrice = artworkInfo.subtotal + fee;
          artworkInfo.promo = foundPromocode._id;
          if (artworkInfo.foundUser) {
            req.session.artwork = artworkInfo.foundUser.cart;
          } else {
            req.session.artwork = null;
          }
        }
      }

      req.session.price = artworkInfo.totalPrice;

      res.render('order/cart', {
        foundUser: artworkInfo.foundUser,
        totalPrice: parseFloat(artworkInfo.totalPrice.toFixed(12)),
        subtotal: parseFloat(artworkInfo.subtotal.toFixed(12)),
        cartIsEmpty: artworkInfo.cartIsEmpty,
        discount: req.session.discount,
        discountPercentage: artworkInfo.discount,
        promo: artworkInfo.promo
      });
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const postPaymentSingle = async (req, res, next) => {
  try {
    console.log(req.session);
    let artwork = req.session.artwork;
    let price = req.session.artwork.price;
    let paid = req.session.price;
    paid *= 100;
    paid = Math.round(paid);
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
          amount: paid,
          currency: 'usd',
          customer: source.customer
        });
      })
      .then(async charge => {
        // New charge created on a new customer
        let order = new Order();
        order.buyer = req.user._id;
        order.seller = artwork.owner;
        order.artwork = artwork._id;
        order.amount = price;
        if (req.session.discount) order.discount = true;
        order.paid = req.session.price;
        order.status = 2;
        const savedOrder = await order.save();
        if (savedOrder) {
          req.session.artwork = null;
          req.session.price = null;
          req.session.discount = null;
          res.redirect('/users/' + req.user._id + '/orders/' + savedOrder._id);
        } else {
          return res.status(400).json({ message: "Couldn't process payment" });
        }
      })
      .catch(err => {
        return res
          .status(400)
          .json({ message: 'Something went wrong, please try again' });
      });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const postPaymentCart = async (req, res, next) => {
  try {
    console.log(req.session);
    let artworks = req.session.artwork;
    let price = req.session.artwork.price;
    let paid = req.session.price;
    paid *= 100;
    paid = Math.round(paid);
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
          amount: paid,
          currency: 'usd',
          customer: source.customer
        });
      })
      .then(async charge => {
        // New charge created on a new customer
        artworks.map(async function(artwork) {
          let order = new Order();
          order.buyer = req.user._id;
          order.seller = artwork.owner;
          order.artwork = artwork._id;
          order.amount = price;
          if (req.session.discount) order.discount = true;
          order.paid = req.session.price;
          order.status = 2;
          const savedOrder = await order.save();
          if (savedOrder) {
            let artworkOwner = req.session.artwork[0].owner;
            users[artworkOwner].emit('increaseNotif', {});
            req.session.artwork = null;
            req.session.price = null;
            req.session.discount = null;
            const updatedUser = await User.update(
              { _id: req.user._id },
              { $set: { cart: [] } }
            );
            if (updatedUser) {
              res.redirect('/users/' + req.user._id + '/orders');
            } else {
              return res
                .status(400)
                .json({ message: 'Couldn\t update user cart' });
            }
          } else {
            return res
              .status(400)
              .json({ message: "Couldn't process payment" });
          }
        });
      })
      .catch(err => {
        return res
          .status(400)
          .json({ message: 'Something went wrong, please try again' });
      });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getOrderId = async (req, res, next) => {
  try {
    req.session.orderId = req.params.orderId;
    const foundOrder = await Order.findOne({ _id: req.params.orderId })
      .populate('buyer')
      .populate('seller')
      .populate('artwork');
    if (foundOrder) {
      res.render('order/order-details', { order: foundOrder });
    } else {
      return res.status(400).json({ message: 'Order not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getSoldOrders = async (req, res, next) => {
  try {
    const foundOrders = await Order.find({ seller: req.user._id })
      .populate('buyer')
      .populate('seller')
      .populate('artwork');
    res.render('order/order-seller', { order: foundOrders });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBoughtOrders = async (req, res, next) => {
  try {
    const foundOrders = await Order.find({ buyer: req.user._id })
      .populate('buyer')
      .populate('seller')
      .populate('artwork');
    res.render('order/order-buyer', { order: foundOrders });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const addToCart = async (req, res, next) => {
  try {
    const artworkId = req.body.artwork_id;
    if (req.user.cart.indexOf(artworkId) > -1) {
      return res.status(400).json({ message: 'Item already in cart' });
    } else {
      const updatedUser = await User.update(
        {
          _id: req.user._id
        },
        {
          $push: { cart: artworkId }
        }
      );
      if (updatedUser) {
        res.status(200).json({ message: 'Added to cart' });
      } else {
        return res.status(400).json({ message: 'Couldn\t update user' });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteFromCart = async (req, res, next) => {
  try {
    const artworkId = req.body.artwork_id;
    const foundArtwork = await Artwork.findOne({ _id: artworkId });
    if (foundArtwork) {
      const updatedUser = await User.update(
        {
          _id: req.user._id
        },
        {
          $pull: { cart: artworkId }
        }
      );
      if (updatedUser) {
        if (req.user.cart.length === 1) {
          req.session.discount = null;
        }
        res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ message: "Couldn't update user " });
      }
    } else {
      return res.status(400).json({ message: "Couldn't find artwork " });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getSingleArtwork,
  getProcessCart,
  postPaymentSingle,
  postPaymentCart,
  getOrderId,
  getSoldOrders,
  getBoughtOrders,
  addToCart,
  deleteFromCart
};
