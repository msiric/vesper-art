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
      newLicense.credentials = license.licenseeName;
      newLicense.company = license.licenseeCompany;
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

// moze to bolje
const getOrder = async (req, res, next) => {
  let order;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { orderId } = req.params;
    const foundOrder = await Order.findOne({ _id: orderId })
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
      if (!foundOrder.buyer._id.equals(res.locals.user.id)) {
        const details = [];
        let sold = 0;
        foundOrder.details.forEach(function (item) {
          if (item.seller.equals(res.locals.user.id)) {
            sold += item.version.personal;
            item.licenses.map(function (license) {
              sold += license.price;
            });
            details.push({
              licenses: item.licenses,
              seller: item.seller,
              version: item.version,
              artwork: item.artwork,
            });
          }
        });
        order = foundOrder.toObject();
        order.details = details;
        order.sold = sold;
      } else {
        const details = [];
        let paid = 0;
        foundOrder.details.forEach(function (item) {
          paid += item.version.personal;
          item.licenses.map(function (license) {
            paid += license.price;
          });
          details.push({
            licenses: item.licenses,
            buyer: item.buyer,
            version: item.version,
            artwork: item.artwork,
          });
        });
        order = foundOrder.toObject();
        order.details = details;
        order.paid = paid;
      }
      if (req.query.ref) {
        const foundNotif = await Notification.findById({
          _id: req.query.ref,
        }).session(session);
        if (foundNotif) {
          let changed = false;
          foundNotif.receivers.forEach(function (receiver) {
            if (receiver.user.equals(res.locals.user.id)) {
              if (receiver.read === false) {
                receiver.read = true;
                changed = true;
              }
            }
          });
          if (changed) {
            await foundNotif.save({ session });
            await User.updateOne(
              {
                _id: res.locals.user.id,
              },
              { $inc: { notifications: -1 } },
              { useFindAndModify: false }
            ).session(session);
            decreaseNotif = true;
          }
        }
      }
      await session.commitTransaction();
      res.json({
        order: order,
        decreaseNotif: decreaseNotif,
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
    const foundOrders = await Order.find({
      details: { $elemMatch: { seller: res.locals.user.id } },
    })
      .populate('buyer')
      .deepPopulate('details.version details.licenses');
    foundOrders.forEach(function (order) {
      const details = [];
      let sold = 0;
      order.details.forEach(function (item) {
        if (item.seller.equals(res.locals.user.id)) {
          sold += item.version.personal;
          item.licenses.map(function (license) {
            sold += license.price;
          });
          details.push({
            licenses: item.licenses,
            seller: item.seller,
            version: item.version,
          });
        }
      });
      order.details = details;
      order.sold = sold;
    });
    res.json({ order: foundOrders });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getBoughtOrders = async (req, res, next) => {
  try {
    const foundOrders = await Order.find({ buyer: res.locals.user.id })
      .populate('buyer')
      .deepPopulate('details.version details.licenses');
    /*       foundOrders.forEach(function(order) {
        const details = [];
        let paid = 0;
        order.details.forEach(function(item) {
          paid += item.version.personal;
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
    res.json({ order: foundOrders });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

module.exports = {
  createOrder,
  getOrder,
  getSoldOrders,
  getBoughtOrders,
};
