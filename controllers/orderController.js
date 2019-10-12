const stripe = require('stripe')('sk_test_gBneokmqdbgLUsAQcHZuR4h500k4P1wiBq');
const Artwork = require('../models/artwork');
const License = require('../models/license');
const Order = require('../models/order');
const Promocode = require('../models/promocode');
const User = require('../models/user');
const Notification = require('../models/notification');
const Review = require('../models/review');
const crypto = require('crypto');

const fee = 3.15;
const commission = 0.1;

const getProcessCart = async (req, res, next) => {
  let artworkInfo = {
    cartIsEmpty: false,
    price: 0,
    totalPrice: 0,
    subtotal: 0,
    license: 0,
    foundUser: null,
    discount: null,
    promo: null,
    artwork: null
  };

  const foundUser = await User.findOne({
    $and: [{ _id: req.user._id }, { active: true }]
  })
    .populate('cart.artwork')
    .populate('cart.licenses');
  try {
    if (foundUser) {
      if (foundUser.cart.length > 0) {
        artworkInfo.foundUser = foundUser;
        foundUser.cart.map(function(item) {
          if (item.artwork.active) {
            artworkInfo.price += item.artwork.price;
            item.licenses.map(function(license) {
              artworkInfo.license += license.price;
            });
          }
        });
        artworkInfo.subtotal = artworkInfo.price;
        artworkInfo.totalPrice = artworkInfo.price + artworkInfo.license + fee;
      } else {
        artworkInfo.cartIsEmpty = true;
      }
      if (foundUser.discount) {
        const foundPromocode = await Promocode.findOne({
          _id: foundUser.discount
        });
        if (foundPromocode && foundPromocode.active) {
          artworkInfo.discount = foundPromocode.discount * 100;
          artworkInfo.promo = foundPromocode._id;
          artworkInfo.totalPrice =
            artworkInfo.totalPrice * (1 - foundPromocode.discount);
        }
      }
      res.render('order/cart', {
        foundUser: artworkInfo.foundUser,
        totalPrice: parseFloat(artworkInfo.totalPrice.toFixed(12)),
        subtotal: parseFloat(artworkInfo.subtotal.toFixed(12)),
        license: parseFloat(artworkInfo.license.toFixed(12)),
        cartIsEmpty: artworkInfo.cartIsEmpty,
        discountPercentage: artworkInfo.discount,
        promo: artworkInfo.promo
      });
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getPaymentCart = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: req.user._id }, { active: true }]
    })
      .populate('cart.artwork')
      .populate('cart.licenses');
    let amount = 0;
    foundUser.cart.map(function(item) {
      if (item.artwork.active) {
        amount += item.artwork.price;
        item.licenses.map(function(license) {
          amount += license.price;
        });
      }
    });
    amount = amount + fee;
    if (foundUser.discount) {
      const foundDiscount = await Promocode.findOne({
        $and: [
          {
            _id: foundUser.discount
          },
          { active: true }
        ]
      });
      if (foundDiscount) {
        amount = amount * (1 - foundDiscount.discount);
      }
    }
    res.render('checkout/payment', {
      amount: parseFloat(amount.toFixed(12))
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const postPaymentCart = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: req.user._id }, { active: true }]
    })
      .populate('cart.artwork')
      .populate('cart.licenses');
    // alternative?
    let paid = 0;
    let discount;
    foundUser.cart.map(function(item) {
      if (item.artwork.active) {
        paid += item.artwork.price;
        item.licenses.map(function(license) {
          paid += license.price;
        });
      }
    });
    if (foundUser.discount) {
      const foundDiscount = await Promocode.findOne({
        $and: [
          {
            _id: foundUser.discount
          },
          { active: true }
        ]
      });
      if (foundDiscount) {
        discount = foundDiscount.discount;
      }
    }
    paid = paid + fee;
    if (discount) {
      paid = paid * (1 - discount);
    }
    paid *= 100;
    paid = Math.round(paid);
    stripe.customers
      .create({
        email: foundUser.email
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

        // Ne valja nista (fale sve licence u kosarici)
        let order = new Order();
        order.bulk = foundUser.cart.length > 1 ? true : false;
        order.discount = foundUser.discount ? true : false;
        foundUser.cart.map(function(item) {
          if (item.artwork.active) {
            let licenses = [];
            totalAmount += item.artwork.price;
            item.licenses.map(function(license) {
              totalAmount += license.price;
              licenses.push(license._id);
            });
            order.details.push({
              seller: item.artwork.owner,
              artwork: item.artwork._id,
              licenses: licenses
            });
          }
        });
        order.sold = totalAmount;
        totalAmount += fee;
        order.buyer = foundUser._id;
        order.paid = discount ? totalAmount * (1 - discount) : totalAmount;
        order.status = 2;
        const savedOrder = await order.save();
        if (savedOrder) {
          const updatedUser = await User.updateOne(
            { _id: foundUser._id },
            { $set: { cart: [], discount: null } }
          );
          if (updatedUser) {
            const orderPath = '/orders/' + savedOrder._id;
            // emit to multiple sellers (needs testing)
            let notification = new Notification();
            foundUser.cart.map(async function(item) {
              if (item.artwork.active) {
                notification.receiver.push(item.artwork.owner);
              }
            });
            notification.link = orderPath;
            notification.message = `${foundUser.name} purchased your artwork!`;
            notification.read = [];
            const savedNotification = await notification.save();
            if (savedNotification) {
              foundUser.cart.map(async function(item) {
                if (item.artwork.active) {
                  await User.updateOne(
                    {
                      _id: item.artwork.owner
                    },
                    {
                      $inc: {
                        notifications: 1,
                        // fale licence
                        incomingFunds: item.artwork.price * (1 - commission)
                      }
                    },
                    { useFindAndModify: false }
                  );
                  if (users[item.artwork.owner]) {
                    users[item.artwork.owner].emit('increaseNotif', {});
                  }
                }
              });
            }
            res.redirect('/orders/bought');
          } else {
            return res
              .status(400)
              .json({ message: "Couldn't update user cart" });
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

const getSoldOrders = async (req, res, next) => {
  try {
    const foundOrders = await Order.find({
      details: { $elemMatch: { seller: req.user._id } }
    })
      .populate('buyer')
      .populate('details');
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
      .populate('details');
    res.render('order/order-buyer', { order: foundOrders });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getOrderId = async (req, res, next) => {
  try {
    let review = [];
    const foundOrder = await Order.findOne({ _id: req.params.orderId })
      .populate('buyer')
      .populate('details');
    if (foundOrder) {
      const foundReview = await Review.find({ artwork: foundOrder.artwork });
      if (foundReview) {
        review = foundReview;
      }
      let decreaseNotif = false;
      // show information only related to seller (needs testing)
      if (!foundOrder.buyer._id.equals(req.user._id)) {
        const artwork = [];
        const amount = [];
        let sellerId = null;
        foundOrder.details.forEach(function(item) {
          if (item.seller._id.equals(req.user._id)) {
            if (!sellerId) {
              sellerId = item.seller._id;
            }
            artwork.push(item.artwork);
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
                const updatedUser = await User.updateOne(
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
        review: review,
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

const addToCart = async (req, res, next) => {
  try {
    const { licenseType, licenseCredentials, artworkId } = req.body;
    if ((licenseType, licenseCredentials, artworkId)) {
      const foundArtwork = await Artwork.findOne({
        $and: [{ _id: artworkId }, { active: true }]
      });
      if (foundArtwork) {
        if (req.user.cart.some(item => item._id == artworkId)) {
          return res.status(400).json({ message: 'Item already in cart' });
        } else {
          const newLicense = new License();
          newLicense.owner = req.user._id;
          newLicense.artwork = foundArtwork._id;
          newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
          newLicense.type = licenseType;
          newLicense.credentials = licenseCredentials;
          newLicense.active = false;
          newLicense.price = foundArtwork.license;

          const savedLicense = await newLicense.save();

          if (savedLicense) {
            const updatedUser = await User.updateOne(
              {
                _id: req.user._id
              },
              {
                $push: {
                  cart: {
                    artwork: artworkId,
                    licenses: savedLicense._id
                  }
                }
              }
            );
            if (updatedUser) {
              res.status(200).json({ message: 'Added to cart' });
            } else {
              return res.status(400).json({ message: 'Could not update user' });
            }
          } else {
            return res.status(400).json({ message: 'Could not save license' });
          }
        }
      } else {
        return res.status(400).json({ message: 'Artwork not found' });
      }
    } else {
      return res.status(400).json({ message: 'All fields are required' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteFromCart = async (req, res, next) => {
  try {
    const { artworkId } = req.body;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }]
    });

    if (foundArtwork) {
      const deletedLicense = await License.remove({
        $and: [
          { artwork: foundArtwork._id },
          { owner: req.user._id },
          { active: false }
        ]
      });
      const updatedUser = await User.updateOne(
        {
          _id: req.user._id
        },
        {
          $pull: { cart: { artwork: artworkId } }
        }
      );
      if (updatedUser) {
        res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ message: 'Could not update user' });
      }
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const increaseArtwork = async (req, res, next) => {
  try {
    const { licenseType, licenseCredentials, artworkId } = req.body;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }]
    });
    if (foundArtwork) {
      const newLicense = new License();
      newLicense.owner = req.user._id;
      newLicense.artwork = foundArtwork._id;
      newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
      newLicense.type = licenseType;
      newLicense.credentials = licenseCredentials;
      newLicense.active = false;
      newLicense.price = foundArtwork.license;

      const savedLicense = await newLicense.save();
      if (savedLicense) {
        const updatedUser = await User.updateOne(
          {
            _id: req.user._id,
            cart: { $elemMatch: { artwork: foundArtwork._id } }
          },
          {
            $push: { 'cart.$.licenses': savedLicense._id }
          }
        );
        if (updatedUser) {
          res.status(200).json({ success: true });
        } else {
          return res.status(400).json({ message: 'Could not update user' });
        }
      } else {
        return res.status(400).json({ message: 'Could not save license' });
      }
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const decreaseArtwork = async (req, res, next) => {
  try {
    const artworkId = req.body.artwork_id;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }]
    });
    if (foundArtwork) {
      const updatedUser = await User.updateOne(
        {
          _id: req.user._id,
          cart: { $elemMatch: { artwork: foundArtwork._id } }
        },
        {
          $pull: { 'cart.$.licenses': savedLicense._id }
        }
      );
      if (updatedUser) {
        res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ message: 'Could not update user' });
      }
    } else {
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProcessCart,
  getPaymentCart,
  postPaymentCart,
  getOrderId,
  getSoldOrders,
  getBoughtOrders,
  addToCart,
  deleteFromCart,
  increaseArtwork,
  decreaseArtwork
};
