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

// needs transaction (done)
// warning (transaction 1 has been committed)
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
    const customer = await stripe.customers.create({ email: foundUser.email });
    if (customer) {
      const source = await stripe.customers.createSource(customer.id, {
        source: req.body.stripeToken
      });
      if (source) {
        await stripe.charges.create({
          amount: paid,
          currency: 'usd',
          customer: source.customer
        });

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
      } else {
        await session.abortTransaction();
        return res
          .status(500)
          .json({ message: 'Error processing your payment' });
      }
    } else {
      await session.abortTransaction();
      return res.status(500).json({ message: 'Error processing your payment' });
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

const getSoldOrders = async (req, res, next) => {
  try {
    const foundOrders = await Order.find({
      details: { $elemMatch: { seller: req.user._id } }
    })
      .populate('buyer')
      .deepPopulate('details.version details.licenses');
    foundOrders.forEach(function(order) {
      const details = [];
      let sold = 0;
      order.details.forEach(function(item) {
        if (item.seller.equals(req.user._id)) {
          sold += item.version.price;
          item.licenses.map(function(license) {
            sold += license.price;
          });
          details.push({
            licenses: item.licenses,
            seller: item.seller,
            version: item.version
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
      .deepPopulate('details.version details.licenses');
    /*       foundOrders.forEach(function(order) {
        const details = [];
        let paid = 0;
        order.details.forEach(function(item) {
          paid += item.version.price;
          item.licenses.map(function(license) {
            paid += license.price;
          });
          details.push({
            licenses: item.licenses,
            buyer: item.buyer,
            version: item.version
          });
        });
        order.details = details;
        order.paid = paid;
      }); */
    res.render('order/order-buyer', { order: foundOrders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// moze to bolje
const getOrderId = async (req, res, next) => {
  let orderWithReviews;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundOrder = await Order.findOne({ _id: req.params.orderId })
      .populate('buyer')
      .populate('discount')
      .deepPopulate('details.version details.artwork.owner details.licenses')
      .session(session);
    if (foundOrder) {
      foundOrder.discount = foundOrder.discount ? foundOrder.discount : null;
      if (foundOrder.discount) {
        foundOrder.discount.discount = foundOrder.discount.discount * 100;
      }
      let decreaseNotif = false;
      let foundReview;
      if (!foundOrder.buyer._id.equals(req.user._id)) {
        foundReview = await Review.find({
          artwork: {
            $in: foundOrder.details.map(item => item.artwork._id)
          }
        }).session(session);
        const details = [];
        let sold = 0;
        foundOrder.details.forEach(function(item) {
          if (item.seller.equals(req.user._id)) {
            sold += item.version.price;
            item.licenses.map(function(license) {
              sold += license.price;
            });
            const review = foundReview.find(review => {
              review.artwork.equals(item.artwork._id);
            });
            details.push({
              licenses: item.licenses,
              seller: item.seller,
              version: item.version,
              artwork: item.artwork,
              review: review
            });
          }
        });
        orderWithReviews = foundOrder.toObject();
        orderWithReviews.details = details;
        orderWithReviews.sold = sold;
      } else {
        foundReview = await Review.find({
          $and: [
            {
              artwork: {
                $in: foundOrder.details.map(item => item.artwork._id)
              }
            },
            { owner: req.user._id }
          ]
        }).session(session);
        const details = [];
        let paid = 0;
        foundOrder.details.forEach(function(item) {
          paid += item.version.price;
          item.licenses.map(function(license) {
            paid += license.price;
          });
          details.push({
            licenses: item.licenses,
            buyer: item.buyer,
            version: item.version,
            artwork: item.artwork,
            review: foundReview.find(review =>
              review.artwork.equals(item.artwork._id)
            )
          });
        });
        orderWithReviews = foundOrder.toObject();
        orderWithReviews.details = details;
        orderWithReviews.paid = paid;
      }
      if (req.query.ref) {
        const foundNotif = await Notification.findById({
          _id: req.query.ref
        }).session(session);
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
            await foundNotif.save({ session });
          }
          const updatedUser = await User.updateOne(
            {
              _id: req.user._id
            },
            { $inc: { notifications: -1 } },
            { useFindAndModify: false }
          ).session(session);
          if (updatedUser) {
            decreaseNotif = true;
          }
        }
      }
      await session.commitTransaction();
      res.render('order/order-details', {
        order: orderWithReviews,
        decreaseNotif: decreaseNotif
      });
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Order not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const addToCart = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { licenseType, licenseCredentials, artworkId } = req.body;
    if ((licenseType, licenseCredentials, artworkId)) {
      const foundArtwork = await Artwork.findOne({
        $and: [{ _id: artworkId }, { active: true }]
      })
        .populate('current')
        .session(session);
      if (foundArtwork) {
        if (req.user.cart.some(item => item.artwork.equals(foundArtwork._id))) {
          await session.abortTransaction();
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

                const savedLicense = await newLicense.save({ session });

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
                  ).session(session);
                  if (updatedUser) {
                    await session.commitTransaction();
                    res.status(200).json({ message: 'Added to cart' });
                  } else {
                    await session.abortTransaction();
                    return res
                      .status(400)
                      .json({ message: 'Could not update user' });
                  }
                } else {
                  await session.abortTransaction();
                  return res
                    .status(400)
                    .json({ message: 'Could not save license' });
                }
              } else {
                await session.abortTransaction();
                return res
                  .status(400)
                  .json({ message: 'Invalid license type' });
              }
            } else {
              await session.abortTransaction();
              return res.status(400).json({ message: 'Invalid license type' });
            }
          } else {
            await session.abortTransaction();
            return res
              .status(400)
              .json({ message: 'Artwork cannot be added to cart' });
          }
        }
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Artwork not found' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'All fields are required' });
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const deleteFromCart = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId } = req.body;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }]
    })
      .populate('current')
      .session(session);
    if (foundArtwork) {
      const deletedLicense = await License.remove({
        $and: [
          { artwork: foundArtwork._id },
          { owner: req.user._id },
          { active: false }
        ]
      }).session(session);
      if (deletedLicense) {
        const updatedUser = await User.updateOne(
          {
            _id: req.user._id
          },
          {
            $pull: { cart: { artwork: foundArtwork._id } }
          }
        ).session(session);
        if (updatedUser) {
          await session.commitTransaction();
          res.status(200).json({ success: true });
        } else {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Could not update user' });
        }
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Could not delete license' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const increaseArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { licenseType, licenseCredentials, artworkId } = req.body;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }]
    })
      .populate('current')
      .session(session);
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
          const savedLicense = await newLicense.save({ session });
          if (savedLicense) {
            const updatedUser = await User.updateOne(
              {
                _id: req.user._id,
                cart: { $elemMatch: { artwork: foundArtwork._id } }
              },
              {
                $push: { 'cart.$.licenses': savedLicense._id }
              }
            ).session(session);
            if (updatedUser) {
              await session.commitTransaction();
              res.status(200).json({ message: 'Artwork quantity increased' });
            } else {
              await session.abortTransaction();
              return res.status(400).json({ message: 'Could not update user' });
            }
          } else {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Could not save license' });
          }
        } else {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Invalid license type' });
        }
      } else {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Invalid license type' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const decreaseArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId, licenseId } = req.body;
    const foundLicense = await License.find({
      $and: [{ artwork: artworkId }, { owner: req.user._id }, { active: false }]
    }).session(session);
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
          ).session(session);
          if (updatedUser) {
            const deletedLicense = await License.remove({
              $and: [
                { _id: targetLicense._id },
                { owner: req.user._id },
                { active: false }
              ]
            }).session(session);
            if (deletedLicense) {
              await session.commitTransaction();
              res.status(200).json({ message: 'License deleted' });
            } else {
              await session.abortTransaction();
              return res
                .status(400)
                .json({ message: 'Could not delete license' });
            }
          } else {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Could not update user' });
          }
        } else {
          await session.abortTransaction();
          return res.status(400).json({ message: 'License not found' });
        }
      } else {
        await session.abortTransaction();
        return res.status(400).json({
          message:
            'At least one license needs to be associated with an artwork in cart'
        });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'License not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
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
