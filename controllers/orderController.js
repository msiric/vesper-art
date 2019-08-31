const stripe = require('stripe')('sk_test_gBneokmqdbgLUsAQcHZuR4h500k4P1wiBq');
const Artwork = require('../models/artwork');
const Order = require('../models/order');
const Promocode = require('../models/promocode');
const User = require('../models/user');
const Notification = require('../models/notification');
const Review = require('../models/review');

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
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { active: true }]
    });
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
        }
      }

      if (artworkInfo.foundUser) {
        req.session.artwork = artworkInfo.foundUser.cart;
      } else {
        req.session.artwork = null;
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
    console.log(artwork);
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
        order.bulk = false;
        order.buyer = req.user._id;
        order.seller = artwork.owner;
        order.artwork = artwork._id;
        order.amount = price;
        order.discount = req.session.discount ? true : false;
        order.paid = req.session.price;
        order.sold = price;
        order.status = 2;
        const savedOrder = await order.save();
        if (savedOrder) {
          // temp
          const orderPath =
            '/users/' + req.user._id + '/orders/' + savedOrder._id;
          req.session.artwork = null;
          req.session.price = null;
          req.session.discount = null;
          // emit to user (needs testing)
          let notification = new Notification();
          notification.receiver.push(artwork.owner);
          notification.link = orderPath;
          notification.message = `${req.user.name} purchased your artwork!`;
          notification.read = [];
          const savedNotification = await notification.save();
          if (savedNotification) {
            const updatedUser = await User.findByIdAndUpdate(
              {
                _id: artwork.owner
              },
              { $inc: { notifications: 1 } },
              { useFindAndModify: false }
            );
            if (users[artwork.owner]) {
              users[artwork.owner].emit('increaseNotif', {});
            }
          }
          res.redirect('/users/' + req.user._id + '/orders/' + savedOrder._id);
        } else {
          return res.status(400).json({ message: "Couldn't process payment" });
        }
      })
      .catch(err => {
        console.log(err);
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
    let artworks = req.session.artwork;
    let paid = req.session.price;
    let orderId = null;
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
        let totalAmount = 0;
        // New charge created on a new customer
        let order = new Order();
        order.bulk = artworks.length > 1 ? true : false;
        order.discount = req.session.discount ? true : false;
        artworks.map(async function(artwork) {
          order.seller.push(artwork.owner);
          order.artwork.push(artwork._id);
          order.amount.push(artwork.price);
          totalAmount = totalAmount + artwork.price;
        });
        order.buyer = req.user._id;
        order.paid = req.session.price;
        order.sold = totalAmount;
        order.status = 2;
        const savedOrder = await order.save();
        if (savedOrder) {
          req.session.artwork = null;
          req.session.price = null;
          req.session.discount = null;
          const updatedUser = await User.update(
            { _id: req.user._id },
            { $set: { cart: [] } }
          );
          if (updatedUser) {
            const orderPath =
              '/users/' + req.user._id + '/orders/' + savedOrder._id;
            // emit to multiple sellers (needs testing)
            let notification = new Notification();
            artworks.map(async function(artwork) {
              notification.receiver.push(artwork.owner);
            });
            notification.link = orderPath;
            notification.message = `${req.user.name} purchased your artwork!`;
            notification.read = [];
            const savedNotification = await notification.save();
            if (savedNotification) {
              artworks.map(async function(artwork) {
                const updatedUser = await User.findByIdAndUpdate(
                  {
                    _id: artwork.owner
                  },
                  { $inc: { notifications: 1 } },
                  { useFindAndModify: false }
                );
              });
              artworks.map(async function(artwork) {
                if (users[artwork.owner]) {
                  users[artwork.owner].emit('increaseNotif', {});
                }
              });
            }
            res.redirect('/users/' + req.user._id + '/orders');
          } else {
            return res
              .status(400)
              .json({ message: 'Couldn\t update user cart' });
          }
        } else {
          return res.status(400).json({ message: "Couldn't process payment" });
        }
      })
      .catch(err => {
        console.log(err);
        return res
          .status(400)
          .json({ message: 'Something went wrong, please try again' });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getOrderId = async (req, res, next) => {
  try {
    let reviews = [];
    req.session.orderId = req.params.orderId;
    const foundOrder = await Order.findOne({ _id: req.params.orderId })
      .populate('buyer')
      .populate('seller')
      .populate('artwork');
    if (foundOrder) {
      // needs to be implemented (with modals?)
      const foundReviews = await Review.find({ artwork: foundOrder.artwork });
      if (foundReviews) {
        reviews = foundReviews;
      }
      let decreaseNotif = false;
      // show information only related to seller (needs testing)
      if (!foundOrder.buyer._id.equals(req.user._id)) {
        const artwork = [];
        const amount = [];
        let sellerId = null;
        foundOrder.seller.forEach(function(seller, i) {
          if (seller._id.equals(req.user._id)) {
            if (!sellerId) {
              sellerId = seller._id;
            }
            artwork.push(foundOrder.artwork[i]);
            amount.push(foundOrder.amount[i]);
          }
        });
        if (!sellerId) {
          return res.status(400).json({ message: 'Order not found' });
        }
        foundOrder.artwork = artwork;
        foundOrder.amount = amount;
      }
      if (req.query.ref) {
        const foundNotif = await Notification.findById({ _id: req.query.ref });
        if (foundNotif) {
          let receiverId = null;
          foundNotif.receiver.forEach(function(receiver, i) {
            if (receiver.equals(req.user._id)) {
              receiverId = req.user._id;
            }
          });
          if (receiverId) {
            let found = false;
            foundNotif.read.forEach(function(read, i) {
              if (read.equals(req.user._id)) {
                found = true;
              }
            });
            if (!found) {
              foundNotif.read.push(req.user._id);
              const savedNotif = await foundNotif.save();
              if (savedNotif) {
                const updatedUser = await User.findByIdAndUpdate(
                  {
                    _id: req.user._id
                  },
                  { $inc: { notifications: -1 } },
                  { useFindAndModify: false }
                );
                if (updatedUser) {
                  decreaseNotif = true;
                }
              }
            }
          }
        }
      }
      res.render('order/order-details', {
        order: foundOrder,
        reviews: reviews,
        decreaseNotif: decreaseNotif
      });
    } else {
      return res.status(400).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
        return res.status(400).json({ message: 'Could not update user' });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteFromCart = async (req, res, next) => {
  try {
    const artworkId = req.body.artwork_id;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }]
    });
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
        return res.status(400).json({ message: 'Could not update user ' });
      }
    } else {
      return res.status(400).json({ message: 'Could not find artwork ' });
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
