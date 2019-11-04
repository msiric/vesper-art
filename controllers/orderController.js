const mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_gBneokmqdbgLUsAQcHZuR4h500k4P1wiBq');
const Artwork = require('../models/artwork');
const Version = require('../models/version');
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
    .deepPopulate('cart.artwork.current')
    .populate('cart.licenses');
  try {
    if (foundUser) {
      if (foundUser.cart.length > 0) {
        artworkInfo.foundUser = foundUser;
        foundUser.cart.map(function(item) {
          if (item.artwork.active) {
            artworkInfo.price += item.artwork.current.price;
            item.licenses.map(function(license) {
              artworkInfo.license += license.price;
            });
          }
        });
        artworkInfo.subtotal = artworkInfo.price;
        artworkInfo.totalPrice = artworkInfo.price + artworkInfo.license;
      } else {
        artworkInfo.cartIsEmpty = true;
      }
      if (foundUser.discount) {
        const foundPromocode = await Promocode.findOne({
          $and: [{ _id: foundUser.discount }, { active: true }]
        });
        if (foundPromocode) {
          artworkInfo.discount = foundPromocode.discount * 100;
          artworkInfo.promo = foundPromocode._id;
          artworkInfo.totalPrice =
            artworkInfo.totalPrice * (1 - foundPromocode.discount);
        }
      }
      artworkInfo.totalPrice = artworkInfo.totalPrice + fee;
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
      .deepPopulate('cart.artwork.current')
      .populate('cart.licenses');
    let amount = 0;
    foundUser.cart.map(function(item) {
      if (item.artwork.active) {
        amount += item.artwork.current.price;
        item.licenses.map(function(license) {
          amount += license.price;
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
        amount = amount * (1 - foundDiscount.discount);
      }
    }
    amount = amount + fee;
    res.render('checkout/payment', {
      amount: parseFloat(amount.toFixed(12))
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const postPaymentCart = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: req.user._id }, { active: true }]
    })
      .deepPopulate('cart.artwork.current')
      .populate('cart.licenses')
      .session(session);
    let paid = 0;
    let licenses = [];
    let discount;
    foundUser.cart.map(function(item) {
      if (item.artwork.active) {
        paid += item.artwork.current.price;
        item.licenses.map(function(license) {
          paid += license.price;
          licenses.push(license._id);
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
      }).session(session);
      if (foundDiscount) {
        discount = foundDiscount;
      }
    }
    if (discount) {
      paid = paid * (1 - discount.discount);
    }
    paid = paid + fee;
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

        let order = new Order();
        order.bulk = foundUser.cart.length > 1 ? true : false;
        order.discount = discount ? discount._id : null;
        foundUser.cart.map(function(item) {
          if (item.artwork.active) {
            let licenses = [];
            totalAmount += item.artwork.current.price;
            item.licenses.map(function(license) {
              totalAmount += license.price;
              licenses.push(license._id);
            });
            order.details.push({
              seller: item.artwork.owner,
              version: item.artwork.current,
              artwork: item.artwork._id,
              licenses: licenses
            });
          }
        });
        order.sold = parseFloat(totalAmount).toFixed(12);
        order.buyer = foundUser._id;
        order.paid = parseFloat(
          (discount
            ? totalAmount * (1 - discount.discount) + fee
            : totalAmount + fee
          ).toFixed(12)
        );
        order.status = 2;
        const savedOrder = await order.save({ session });
        if (savedOrder) {
          const updatedLicense = await License.updateMany(
            { _id: licenses },
            { active: true }
          ).session(session);
          if (updatedLicense) {
            const updatedUser = await User.updateOne(
              { _id: foundUser._id },
              { $set: { cart: [], discount: null } }
            ).session(session);
            if (updatedUser) {
              const orderPath = '/orders/' + savedOrder._id;
              // emit to multiple sellers (needs testing)
              let notification = new Notification();
              foundUser.cart.map(async function(item) {
                if (item.artwork.active) {
                  notification.receivers.push({
                    user: item.artwork.owner,
                    read: false
                  });
                }
              });
              notification.link = orderPath;
              notification.message = `${foundUser.name} purchased your artwork!`;
              notification.read = [];
              const savedNotification = await notification.save({ session });
              if (savedNotification) {
                foundUser.cart.map(async function(item) {
                  if (item.artwork.active) {
                    let funds = 0;
                    funds += item.artwork.current.price;
                    item.licenses.map(function(license) {
                      funds += license.price;
                    });
                    await User.updateOne(
                      {
                        _id: item.artwork.owner
                      },
                      {
                        $inc: {
                          notifications: 1,
                          incomingFunds: funds * (1 - commission)
                        }
                      },
                      { useFindAndModify: false }
                    ).session(session);
                    if (users[item.artwork.owner]) {
                      users[item.artwork.owner].emit('increaseNotif', {});
                    }
                  }
                });
              }
              await session.commitTransaction();
              res.redirect('/orders/bought');
            } else {
              await session.abortTransaction();
              return res
                .status(400)
                .json({ message: "Couldn't update user cart" });
            }
          } else {
            await session.abortTransaction();
            return res
              .status(400)
              .json({ message: "Couldn't update licenses" });
          }
        } else {
          await session.abortTransaction();
          return res.status(400).json({ message: "Couldn't process payment" });
        }
      })
      .catch(async err => {
        console.log(err);
        return res
          .status(400)
          .json({ message: 'Something went wrong, please try again' });
      });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

// moze to bolje
const getSoldOrders = async (req, res, next) => {
  try {
    const foundOrders = await Order.find({
      details: { $elemMatch: { seller: req.user._id } }
    })
      .populate('buyer')
      .deepPopulate('details.version details.licenses');
    const details = [];
    let sold = 0;
    foundOrders.forEach(function(order) {
      order.details.forEach(function(item) {
        if (item.seller.equals(req.user._id)) {
          sold += item.version.price;
          item.licenses.map(function(license) {
            sold += license.price;
          });
          details.push({
            licenses: item.licenses,
            seller: item.seller,
            artwork: item.version
          });
        }
      });
      order.details = details;
      order.sold = sold;
    });

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
      .deepPopulate('details.version');
    res.render('order/order-buyer', { order: foundOrders });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// moze to bolje
const getOrderId = async (req, res, next) => {
  try {
    let review = [];
    const foundOrder = await Order.findOne({ _id: req.params.orderId })
      .populate('buyer')
      .populate('discount')
      .deepPopulate('details.version details.artwork details.licenses');
    if (foundOrder) {
      foundOrder.discount = foundOrder.discount ? foundOrder.discount : null;
      if (foundOrder.discount) {
        foundOrder.discount.discount = foundOrder.discount.discount * 100;
      }
      const foundReview = await Review.find({ artwork: foundOrder.artwork });
      if (foundReview) {
        review = foundReview;
      }
      let decreaseNotif = false;
      // show information only related to seller (needs testing)
      if (!foundOrder.buyer._id.equals(req.user._id)) {
        const details = [];
        let sold = 0;
        foundOrder.details.forEach(function(item) {
          if (item.seller.equals(req.user._id)) {
            sold += item.version.price;
            item.licenses.map(function(license) {
              sold += license.price;
            });
            details.push({
              licenses: item.licenses,
              seller: item.seller,
              artwork: item.version
            });
          }
        });
        if (details.length < 1) {
          return res.status(400).json({ message: 'Order not found' });
        }
        foundOrder.details = details;
        foundOrder.sold = sold;
      }
      if (req.query.ref) {
        const foundNotif = await Notification.findById({ _id: req.query.ref });
        if (foundNotif) {
          let changed = false;
          foundNotif.receivers.forEach(function(receiver) {
            if (receiver.user.equals(req.user._id)) {
              if (receiver.read === false) {
                receiver.read = true;
                changed = true;
              }
            }
          });
          if (changed) {
            await foundNotif.save();
          }
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
      }).populate('current');
      if (foundArtwork) {
        if (req.user.cart.some(item => item.artwork.equals(foundArtwork._id))) {
          return res.status(400).json({ message: 'Item already in cart' });
        } else {
          if (
            foundArtwork.current.type != 'showcase' &&
            foundArtwork.current.available
          ) {
            if (licenseType == 'personal' || licenseType == 'commercial') {
              if (
                !(
                  licenseType == 'commercial' &&
                  foundArtwork.current.use == 'personal'
                )
              ) {
                const newLicense = new License();
                newLicense.owner = req.user._id;
                newLicense.artwork = foundArtwork._id;
                newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
                newLicense.type = licenseType;
                newLicense.credentials = licenseCredentials;
                newLicense.active = false;
                newLicense.price =
                  licenseType == 'commercial'
                    ? foundArtwork.current.license
                    : 0;

                const savedLicense = await newLicense.save();

                if (savedLicense) {
                  const updatedUser = await User.updateOne(
                    {
                      _id: req.user._id
                    },
                    {
                      $push: {
                        cart: {
                          artwork: foundArtwork._id,
                          licenses: savedLicense._id
                        }
                      }
                    }
                  );
                  if (updatedUser) {
                    res.status(200).json({ message: 'Added to cart' });
                  } else {
                    return res
                      .status(400)
                      .json({ message: 'Could not update user' });
                  }
                } else {
                  return res
                    .status(400)
                    .json({ message: 'Could not save license' });
                }
              } else {
                return res
                  .status(400)
                  .json({ message: 'Invalid license type' });
              }
            } else {
              return res.status(400).json({ message: 'Invalid license type' });
            }
          } else {
            return res
              .status(400)
              .json({ message: 'Artwork cannot be added to cart' });
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
    }).populate('current');
    if (foundArtwork) {
      const deletedLicense = await License.remove({
        $and: [
          { artwork: foundArtwork._id },
          { owner: req.user._id },
          { active: false }
        ]
      });
      if (deletedLicense) {
        const updatedUser = await User.updateOne(
          {
            _id: req.user._id
          },
          {
            $pull: { cart: { artwork: foundArtwork._id } }
          }
        );
        if (updatedUser) {
          res.status(200).json({ success: true });
        } else {
          return res.status(400).json({ message: 'Could not update user' });
        }
      } else {
        return res.status(400).json({ message: 'Could not delete license' });
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
    }).populate('current');
    if (foundArtwork) {
      if (licenseType == 'personal' || licenseType == 'commercial') {
        if (
          !(
            licenseType == 'commercial' &&
            foundArtwork.current.use == 'personal'
          )
        ) {
          const newLicense = new License();
          newLicense.owner = req.user._id;
          newLicense.artwork = foundArtwork._id;
          newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
          newLicense.type = licenseType;
          newLicense.credentials = licenseCredentials;
          newLicense.active = false;
          newLicense.price =
            licenseType == 'commercial' ? foundArtwork.current.license : 0;
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
              res.status(200).json({ message: 'Artwork quantity increased' });
            } else {
              return res.status(400).json({ message: 'Could not update user' });
            }
          } else {
            return res.status(400).json({ message: 'Could not save license' });
          }
        } else {
          return res.status(400).json({ message: 'Invalid license type' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid license type' });
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
    const { artworkId, licenseId } = req.body;
    const foundLicense = await License.find({
      $and: [{ artwork: artworkId }, { owner: req.user._id }, { active: false }]
    });
    if (foundLicense) {
      if (foundLicense.length > 1) {
        const targetLicense = foundLicense.find(license =>
          license._id.equals(licenseId)
        );
        if (targetLicense) {
          const updatedUser = await User.updateOne(
            {
              _id: req.user._id,
              cart: { $elemMatch: { artwork: targetLicense.artwork } }
            },
            {
              $pull: {
                'cart.$.licenses': targetLicense._id
              }
            }
          );
          if (updatedUser) {
            const deletedLicense = await License.remove({
              $and: [
                { _id: targetLicense._id },
                { owner: req.user._id },
                { active: false }
              ]
            });
            if (deletedLicense) {
              res.status(200).json({ message: 'License deleted' });
            } else {
              return res
                .status(400)
                .json({ message: 'Could not delete license' });
            }
          } else {
            return res.status(400).json({ message: 'Could not update user' });
          }
        } else {
          return res.status(400).json({ message: 'License not found' });
        }
      } else {
        return res.status(400).json({
          message:
            'At least one license needs to be associated with an artwork in cart'
        });
      }
    } else {
      return res.status(400).json({ message: 'License not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getLicenseInformation = async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    const foundLicenses = await License.find({
      $and: [{ artwork: artworkId }, { owner: req.user._id }, { active: false }]
    }).sort({ created: -1 });
    return res.status(200).json(foundLicenses);
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
  decreaseArtwork,
  getLicenseInformation
};
