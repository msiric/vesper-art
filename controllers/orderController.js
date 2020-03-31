const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const Notification = require('../models/notification');
const Review = require('../models/review');
const createError = require('http-errors');

const getSoldOrders = async (req, res, next) => {
  try {
    const foundOrders = await Order.find({
      details: { $elemMatch: { seller: res.locals.user.id } }
    })
      .populate('buyer')
      .deepPopulate('details.version details.licenses');
    foundOrders.forEach(function(order) {
      const details = [];
      let sold = 0;
      order.details.forEach(function(item) {
        if (item.seller.equals(res.locals.user.id)) {
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
    res.json({ order: foundOrders });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

// moze to bolje
const getOrderId = async (req, res, next) => {
  let orderWithReviews;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundOrder = await Order.findOne({ _id: req.params.id })
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
      if (!foundOrder.buyer._id.equals(res.locals.user.id)) {
        foundReview = await Review.find({
          artwork: {
            $in: foundOrder.details.map(item => item.artwork._id)
          }
        }).session(session);
        const details = [];
        let sold = 0;
        foundOrder.details.forEach(function(item) {
          if (item.seller.equals(res.locals.user.id)) {
            sold += item.version.price;
            item.licenses.map(function(license) {
              sold += license.price;
            });
            const review = foundReview.find(review =>
              review.artwork.equals(item.artwork._id)
            );
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
            { owner: res.locals.user.id }
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
                _id: res.locals.user.id
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
        order: orderWithReviews,
        decreaseNotif: decreaseNotif
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

module.exports = {
  getOrderId,
  getSoldOrders,
  getBoughtOrders
};
