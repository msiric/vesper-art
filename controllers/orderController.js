const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const License = require('../models/license');
const Notification = require('../models/notification');
const createError = require('http-errors');
const crypto = require('crypto');

const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const orderData = JSON.parse('orderData');
    // $TODO notification
    const buyerId = mongoose.Types.ObjectId(orderData.buyerId);
    const sellerId = mongoose.Types.ObjectId(orderData.sellerId);
    const artworkId = mongoose.Types.ObjectId(orderData.artworkId);
    const versionId = mongoose.Types.ObjectId(orderData.versionId);
    const discountId = mongoose.Types.ObjectId(orderData.discountId);
    const licenseSet = [];
    const licenseIds = [];
    orderData.licenses.forEach(async (license) => {
      const newLicense = new License();
      newLicense.owner = buyerId;
      newLicense.artwork = artworkId;
      newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
      newLicense.type = license.licenseType;
      newLicense.active = true;
      newLicense.price =
        license.licenseType == 'commercial'
          ? foundArtwork.current.commercial
          : foundArtwork.current.personal;
      licenseSet.push(newLicense);
    });
    const savedLicenses = await License.insertMany(licenseSet, { session });
    savedLicenses.forEach((license) => {
      licenseIds.push(license._id);
    });
    const newOrder = new Order();
    newOrder.buyer = buyerId;
    newOrder.seller = sellerId;
    newOrder.artwork = artworkId;
    newOrder.version = versionId;
    newOrder.discount = discountId;
    newOrder.licenses = licenseIds;
    newOrder.review = null;
    newOrder.amount = orderData.amount;
    newOrder.fee = orderData.fee;
    newOrder.status = 'completed';
    newOrder.intent = '$TODO retrieve payment intent id';
    const savedOrder = await newOrder.save({ session });
    await User.updateOne(
      { _id: buyerId },
      { $push: { purchases: savedOrder._id } }
    ).session(session);
    await User.updateOne(
      { _id: sellerId },
      { $push: { sales: savedOrder._id } }
    ).session(session);
    await session.commitTransaction();
    return res.status(200).json('/');
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

const getOrderDetails = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { orderId } = req.params;
    const foundOrder = await Order.findOne({
      $and: [
        {
          $or: [{ buyer: res.locals.user.id }, { seller: res.locals.user.id }],
        },
        { _id: orderId },
      ],
    })
      .populate('buyer')
      .populate('seller')
      .populate('discount')
      .populate('version')
      .populate('artwork')
      .deepPopulate('licenses.artwork')
      .populate('review')
      .session(session);
    if (foundOrder) {
      // let decreaseNotif = false;
      // notif
      // if (req.query.ref) {
      //   const foundNotif = await Notification.findById({
      //     _id: req.query.ref,
      //   }).session(session);
      //   if (foundNotif) {
      //     let changed = false;
      //     foundNotif.receivers.forEach(function (receiver) {
      //       if (receiver.user.equals(res.locals.user.id)) {
      //         if (receiver.read === false) {
      //           receiver.read = true;
      //           changed = true;
      //         }
      //       }
      //     });
      //     if (changed) {
      //       await foundNotif.save({ session });
      //       await User.updateOne(
      //         {
      //           _id: res.locals.user.id,
      //         },
      //         { $inc: { notifications: -1 } },
      //         { useFindAndModify: false }
      //       ).session(session);
      //       decreaseNotif = true;
      //     }
      //   }
      // }
      await session.commitTransaction();
      res.json({
        order: foundOrder,
      });
    } else {
      throw createError(400, 'Order not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

const getSoldOrders = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      _id: res.locals.user.id,
    }).deepPopulate('sales.buyer sales.version sales.review');
    res.json({ sales: foundUser.sales });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getBoughtOrders = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      _id: res.locals.user.id,
    }).deepPopulate('purchases.seller purchases.version purchases.review');
    res.json({ purchases: foundUser.purchases });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

module.exports = {
  createOrder,
  getOrderDetails,
  getSoldOrders,
  getBoughtOrders,
};
