const mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_gBneokmqdbgLUsAQcHZuR4h500k4P1wiBq');
const Artwork = require('../models/artwork');
const License = require('../models/license');
const Order = require('../models/order');
const Promocode = require('../models/promocode');
const User = require('../models/user');
const Notification = require('../models/notification');
const crypto = require('crypto');
const createError = require('http-errors');

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
    artwork: null,
  };

  const foundUser = await User.findOne({
    $and: [{ _id: res.locals.user.id }, { active: true }],
  })
    .deepPopulate(
      'cart.artwork.current',
      '_id cover created title price type license availability description'
    )
    .populate('cart.licenses');
  try {
    if (foundUser) {
      if (foundUser.cart.length > 0) {
        artworkInfo.foundUser = foundUser;
        foundUser.cart.map(function (item) {
          if (item.artwork.active) {
            artworkInfo.price += item.artwork.current.price;
            item.licenses.map(function (license) {
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
          $and: [{ _id: foundUser.discount }, { active: true }],
        });
        if (foundPromocode) {
          artworkInfo.discount = foundPromocode.discount * 100;
          artworkInfo.promo = foundPromocode._id;
          artworkInfo.totalPrice =
            artworkInfo.totalPrice * (1 - foundPromocode.discount);
        }
      }
      artworkInfo.totalPrice = artworkInfo.totalPrice + fee;
      res.json({
        foundUser: artworkInfo.foundUser,
        totalPrice: parseFloat(artworkInfo.totalPrice.toFixed(12)),
        subtotal: parseFloat(artworkInfo.subtotal.toFixed(12)),
        license: parseFloat(artworkInfo.license.toFixed(12)),
        cartIsEmpty: artworkInfo.cartIsEmpty,
        discountPercentage: artworkInfo.discount,
        promo: artworkInfo.promo,
      });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getPaymentCart = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    })
      .deepPopulate(
        'cart.artwork.current',
        '_id cover created title price type license availability description'
      )
      .populate('cart.licenses');
    if (foundUser) {
      let amount = 0;
      foundUser.cart.map(function (item) {
        if (item.artwork.active) {
          amount += item.artwork.current.price;
          item.licenses.map(function (license) {
            amount += license.price;
          });
        }
      });
      if (foundUser.discount) {
        const foundDiscount = await Promocode.findOne({
          $and: [
            {
              _id: foundUser.discount,
            },
            { active: true },
          ],
        });
        if (foundDiscount) {
          amount = amount * (1 - foundDiscount.discount);
        }
      }
      amount = amount + fee;
      res.json({
        amount: parseFloat(amount.toFixed(12)),
      });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

// needs transaction (done)
// warning (transaction 1 has been committed)
const postPaymentCart = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    })
      .deepPopulate(
        'cart.artwork.current',
        '_id cover created title price type license availability description'
      )
      .populate('cart.licenses')
      .session(session);
    if (foundUser) {
      let paid = 0;
      let licenses = [];
      let discount;
      foundUser.cart.map(function (item) {
        if (item.artwork.active) {
          paid += item.artwork.current.price;
          item.licenses.map(function (license) {
            paid += license.price;
            licenses.push(license._id);
          });
        }
      });
      if (foundUser.discount) {
        const foundDiscount = await Promocode.findOne({
          $and: [
            {
              _id: foundUser.discount,
            },
            { active: true },
          ],
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
      const customer = await stripe.customers.create({
        email: foundUser.email,
      });
      if (customer) {
        const source = await stripe.customers.createSource(customer.id, {
          source: req.body.stripeToken,
        });
        if (source) {
          await stripe.charges.create({
            amount: paid,
            currency: 'usd',
            customer: source.customer,
          });

          let totalAmount = 0;
          // New charge created on a new customer

          let order = new Order();
          order.bulk = foundUser.cart.length > 1 ? true : false;
          order.discount = discount ? discount._id : null;
          foundUser.cart.map(function (item) {
            if (item.artwork.active) {
              let licenses = [];
              totalAmount += item.artwork.current.price;
              item.licenses.map(function (license) {
                totalAmount += license.price;
                licenses.push(license._id);
              });
              order.details.push({
                seller: item.artwork.owner,
                version: item.artwork.current,
                artwork: item.artwork._id,
                licenses: licenses,
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
          await License.updateMany({ _id: licenses }, { active: true }).session(
            session
          );
          await User.updateOne(
            { _id: foundUser._id },
            { $set: { cart: [], discount: null } }
          ).session(session);
          const orderPath = '/orders/' + savedOrder._id;
          // emit to multiple sellers (needs testing)
          let notification = new Notification();
          foundUser.cart.map(async function (item) {
            if (item.artwork.active) {
              notification.receivers.push({
                user: item.artwork.owner,
                read: false,
              });
            }
          });
          notification.link = orderPath;
          notification.message = `${foundUser.name} purchased your artwork!`;
          notification.read = [];
          await notification.save({ session });
          foundUser.cart.map(async function (item) {
            if (item.artwork.active) {
              let funds = 0;
              funds += item.artwork.current.price;
              item.licenses.map(function (license) {
                funds += license.price;
              });
              await User.updateOne(
                {
                  _id: item.artwork.owner,
                },
                {
                  $inc: {
                    notifications: 1,
                    incomingFunds: funds * (1 - commission),
                  },
                },
                { useFindAndModify: false }
              ).session(session);
              if (users[item.artwork.owner]) {
                users[item.artwork.owner].emit('increaseNotif', {});
              }
            }
          });
          await session.commitTransaction();
          res.redirect('/orders/bought');
        } else {
          throw createError(400, 'Error processing your payment');
        }
      } else {
        throw createError(400, 'Error processing your payment');
      }
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
// treba sredit
const addToCart = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { licenseType, licenseCredentials, artworkId } = req.body;
    if ((licenseType, licenseCredentials, artworkId)) {
      const foundArtwork = await Artwork.findOne({
        $and: [{ _id: artworkId }, { active: true }],
      })
        .populate(
          'current',
          '_id cover created title price type license availability description'
        )
        .session(session);
      if (foundArtwork) {
        if (
          req.user.cart.some((item) => item.artwork.equals(foundArtwork._id))
        ) {
          throw createError(400, 'Item already in cart');
        } else {
          if (
            foundArtwork.current.availability === 'available' &&
            foundArtwork.current.type === 'commercial'
          ) {
            if (licenseType == 'personal' || licenseType == 'commercial') {
              if (
                !(
                  licenseType == 'commercial' &&
                  foundArtwork.current.type == 'personal'
                )
              ) {
                const newLicense = new License();
                newLicense.owner = res.locals.user.id;
                newLicense.artwork = foundArtwork._id;
                newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
                newLicense.type = licenseType;
                newLicense.credentials = licenseCredentials;
                newLicense.active = false;
                newLicense.price =
                  licenseType == 'commercial'
                    ? foundArtwork.current.commercial
                    : 0;

                const savedLicense = await newLicense.save({ session });
                await User.updateOne(
                  {
                    _id: res.locals.user.id,
                  },
                  {
                    $push: {
                      cart: {
                        artwork: foundArtwork._id,
                        licenses: savedLicense._id,
                      },
                    },
                  }
                ).session(session);
                await session.commitTransaction();
                res.status(200).json({ message: 'Added to cart' });
              } else {
                throw createError(400, 'Invalid license type');
              }
            } else {
              throw createError(400, 'Invalid license type');
            }
          } else {
            throw createError(400, 'Artwork cannot be added to cart');
          }
        }
      } else {
        throw createError(400, 'Artwork not found');
      }
    } else {
      throw createError(400, 'All fields are required');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
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
      $and: [{ _id: artworkId }, { active: true }],
    })
      .populate(
        'current',
        '_id cover created title price type license availability description'
      )
      .session(session);
    if (foundArtwork) {
      await License.remove({
        $and: [
          { artwork: foundArtwork._id },
          { owner: res.locals.user.id },
          { active: false },
        ],
      }).session(session);
      await User.updateOne(
        {
          _id: res.locals.user.id,
        },
        {
          $pull: { cart: { artwork: foundArtwork._id } },
        }
      ).session(session);
      await session.commitTransaction();
      res.status(200).json({ success: true });
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
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
      $and: [{ _id: artworkId }, { active: true }],
    })
      .populate(
        'current',
        '_id cover created title price type license availability description'
      )
      .session(session);
    if (foundArtwork) {
      if (licenseType == 'personal' || licenseType == 'commercial') {
        if (
          !(
            licenseType == 'commercial' &&
            foundArtwork.current.type == 'personal'
          )
        ) {
          const newLicense = new License();
          newLicense.owner = res.locals.user.id;
          newLicense.artwork = foundArtwork._id;
          newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
          newLicense.type = licenseType;
          newLicense.credentials = licenseCredentials;
          newLicense.active = false;
          newLicense.price =
            licenseType == 'commercial' ? foundArtwork.current.commercial : 0;
          await newLicense.save({ session });
          await User.updateOne(
            {
              _id: res.locals.user.id,
              cart: { $elemMatch: { artwork: foundArtwork._id } },
            },
            {
              $push: { 'cart.$.licenses': savedLicense._id },
            }
          ).session(session);
          await session.commitTransaction();
          res.status(200).json({ message: 'Artwork quantity increased' });
        } else {
          throw createError(400, 'Invalid license type');
        }
      } else {
        throw createError(400, 'Invalid license type');
      }
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
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
      $and: [
        { artwork: artworkId },
        { owner: res.locals.user.id },
        { active: false },
      ],
    }).session(session);
    if (foundLicense) {
      if (foundLicense.length > 1) {
        const targetLicense = foundLicense.find((license) =>
          license._id.equals(licenseId)
        );
        if (targetLicense) {
          await User.updateOne(
            {
              _id: res.locals.user.id,
              cart: { $elemMatch: { artwork: targetLicense.artwork } },
            },
            {
              $pull: {
                'cart.$.licenses': targetLicense._id,
              },
            }
          ).session(session);
          await License.remove({
            $and: [
              { _id: targetLicense._id },
              { owner: res.locals.user.id },
              { active: false },
            ],
          }).session(session);
          await session.commitTransaction();
          res.status(200).json({ message: 'License deleted' });
        } else {
          throw createError(400, 'License not found');
        }
      } else {
        throw createError(
          400,
          'At least one license needs to be associated with an artwork in cart'
        );
      }
    } else {
      throw createError(400, 'License not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

module.exports = {
  getProcessCart,
  getPaymentCart,
  postPaymentCart,
  addToCart,
  deleteFromCart,
  increaseArtwork,
  decreaseArtwork,
};
