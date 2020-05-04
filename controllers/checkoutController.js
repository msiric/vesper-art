const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Artwork = require('../models/artwork');
const License = require('../models/license');
const Order = require('../models/order');
const Discount = require('../models/discount');
const User = require('../models/user');
const Notification = require('../models/notification');
const crypto = require('crypto');
const currency = require('currency.js');
const createError = require('http-errors');

const createPaymentIntent = async (req, res, next) => {
  try {
    /* const { artworkId } = req.params;
    const { licenses } = req.body;
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    }).populate('discount');
    if (foundUser) {
      const foundArtwork = await Artwork.findOne({
        $and: [{ _id: artworkId }, { active: true }],
      })
        .populate('owner')
        .populate(
          'current',
          '_id cover created title price type license availability description use commercial'
        );
      if (foundArtwork) {
        let personalLicenses = 0;
        let commercialLicenses = 0;
        licenses.map((license) => {
          if (license.licenseType === 'personal')
            personalLicenses += foundArtwork.current.price;
          else if (license.licenseType === 'commercial')
            commercialLicenses +=
              foundArtwork.current.price + foundArtwork.current.commercial;
        });
        const buyerFee = currency(personalLicenses)
          .add(commercialLicenses)
          .multiply(0.05)
          .add(2.45);
        const sellerFee = currency(0.85);
        const discount = foundUser.discount
          ? currency(personalLicenses)
              .add(commercialLicenses)
              .multiply(foundUser.discount.discount)
          : 0;
        const buyerTotal = currency(personalLicenses)
          .add(commercialLicenses)
          .subtract(discount)
          .add(buyerFee);
        const sellerTotal = currency(personalLicenses)
          .add(commercialLicenses)
          .multiply(sellerFee);
        const platformTotal = currency(buyerTotal).subtract(sellerTotal);
        const stripeFees = currency(1.03).add(2).add(0.3);
        const total = currency(platformTotal).subtract(stripeFees);
        console.log(
          'buyerTotal',
          buyerTotal.intValue,
          'sellerTotal',
          sellerTotal.intValue,
          'platformTotal',
          platformTotal.intValue,
          'stripeFees',
          stripeFees.intValue,
          'total',
          total.intValue
        );
        const paymentIntent = await stripe.paymentIntents.create({
          payment_method_types: ['card'],
          amount: buyerTotal.intValue,
          currency: 'usd',
          application_fee_amount: platformTotal.intValue,
          transfer_data: {
            destination: foundArtwork.owner.stripeId,
          },
        });

        res.json({
          intent: paymentIntent.client_secret,
        });
      } else {
        throw createError(400, 'Artwork not found');
      }
    } else {
      throw createError(400, 'User not found');
    } */
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getProcessCart = async (req, res, next) => {
  /*   let artworkInfo = {
    cartIsEmpty: false,
    price: 0,
    totalPrice: 0,
    subtotal: 0,
    license: 0,
    foundUser: null,
    discountId: null,
    discount: null,
    artwork: null,
  }; */
  let foundDiscount = null;
  const foundUser = await User.findOne({
    $and: [{ _id: res.locals.user.id }, { active: true }],
  })
    .deepPopulate(
      'cart.artwork.current',
      '_id cover created title price type license availability description use commercial'
    )
    .populate('cart.licenses');
  try {
    if (foundUser) {
      /*       if (foundUser.cart.length > 0) {
        artworkInfo.foundUser = foundUser;
        foundUser.cart.map(function (item) {
          if (
            item.artwork.active &&
            item.artwork.current.availability === 'available'
          ) {
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
      } */
      if (foundUser.discount)
        foundDiscount = await Discount.findOne({
          $and: [{ _id: foundUser.discount }, { active: true }],
        });

      /*       artworkInfo.totalPrice = artworkInfo.totalPrice + fee; */
      res.json({
        cart: foundUser.cart,
        discount: foundDiscount,
        /*         foundUser: artworkInfo.foundUser,
        totalPrice: parseFloat(artworkInfo.totalPrice.toFixed(12)),
        subtotal: parseFloat(artworkInfo.subtotal.toFixed(12)),
        license: parseFloat(artworkInfo.license.toFixed(12)),
        cartIsEmpty: artworkInfo.cartIsEmpty,
        discountId: artworkInfo.discountId,
        discountPercentage: artworkInfo.discount, */
      });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

// $CART
const getPaymentCart_Old = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    })
      .deepPopulate(
        'cart.artwork.current',
        '_id cover created title price type license availability description use commercial'
      )
      .populate('cart.licenses');
    if (foundUser) {
      let amount = 0;
      foundUser.cart.map(function (item) {
        if (
          item.artwork.active &&
          item.artwork.current.availability === 'available'
        ) {
          amount += item.artwork.current.price;
          item.licenses.map(function (license) {
            amount += license.price;
          });
        }
      });
      if (foundUser.discount) {
        const foundDiscount = await Discount.findOne({
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

const getCheckout = async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }],
    }).populate(
      'current',
      '_id cover created title price type license availability description use commercial'
    );
    if (foundArtwork) {
      const foundUser = await User.findOne({
        $and: [{ _id: res.locals.user.id }, { active: true }],
      }).populate('discount');
      res.json({
        artwork: foundArtwork,
        discount: foundUser.discount,
      });
    } else {
      throw createError(400, 'Artwork not found');
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
    const { stripeToken } = req.body;
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    })
      .deepPopulate(
        'cart.artwork.current',
        '_id cover created title price type license availability description use commercial'
      )
      .populate('cart.licenses')
      .session(session);
    if (foundUser) {
      let paid = 0;
      let licenses = [];
      let discount;
      foundUser.cart.map(function (item) {
        if (
          item.artwork.active &&
          item.artwork.current.availability === 'available'
        ) {
          paid += item.artwork.current.price;
          item.licenses.map(function (license) {
            paid += license.price;
            licenses.push(license._id);
          });
        }
      });
      if (foundUser.discount) {
        const foundDiscount = await Discount.findOne({
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
          source: stripeToken,
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
            if (
              item.artwork.active &&
              item.artwork.current.availability === 'available'
            ) {
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
            if (
              item.artwork.active &&
              item.artwork.current.availability === 'available'
            ) {
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
            if (
              item.artwork.active &&
              item.artwork.current.availability === 'available'
            ) {
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
    const { artworkId } = req.params;
    const { licenseType, licenseeName, licenseeCompany } = req.body;
    if ((licenseType, licenseeName)) {
      const foundArtwork = await Artwork.findOne({
        $and: [{ _id: artworkId }, { active: true }],
      })
        .populate(
          'current',
          '_id cover created title price type license availability description use commercial'
        )
        .session(session);
      if (foundArtwork) {
        const foundUser = await User.findOne({
          $and: [{ _id: res.locals.user.id }, { active: true }],
        });
        if (
          foundUser.cart.some((item) => item.artwork.equals(foundArtwork._id))
        ) {
          throw createError(400, 'Item already in cart');
        } else {
          if (foundArtwork.current.availability === 'available') {
            if (licenseType == 'personal' || licenseType == 'commercial') {
              const newLicense = new License();
              newLicense.owner = res.locals.user.id;
              newLicense.artwork = foundArtwork._id;
              newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
              newLicense.type = licenseType;
              newLicense.credentials = licenseeName;
              newLicense.company = licenseeCompany;
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
    const { artworkId } = req.params;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }],
    })
      .populate(
        'current',
        '_id cover created title price type license availability description use commercial'
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

module.exports = {
  createPaymentIntent,
  getProcessCart,
  // $CART
  /* getPaymentCart */
  getCheckout,
  postPaymentCart,
  addToCart,
  deleteFromCart,
};
