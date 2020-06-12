import mongoose from 'mongoose';
import Order from '../models/order.js';
import User from '../models/user.js';

export const addNewOrder = async ({ orderData, session = null }) => {
  const newOrder = new Order();
  newOrder.buyer = orderData.buyerId;
  newOrder.seller = orderData.sellerId;
  newOrder.artwork = orderData.artworkId;
  newOrder.version = orderData.versionId;
  newOrder.discount = orderData.discountId;
  newOrder.licenses = orderData.licenseIds;
  newOrder.review = orderData.review;
  newOrder.spent = orderData.spent;
  newOrder.earned = orderData.earned;
  newOrder.fee = orderData.fee;
  newOrder.status = orderData.status;
  newOrder.intent = orderData.intentId;
  return await newOrder.save({ session });
};

export const fetchOrderDetails = async ({
  userId,
  orderId,
  session = null,
}) => {
  return await Order.findOne({
    $and: [
      {
        $or: [{ buyer: userId }, { seller: userId }],
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
};

export const fetchUserOrder = async ({ orderId, userId, session = null }) => {
  return await Order.findOne({
    $and: [{ _id: orderId }, { buyer: userId }],
  })
    .populate('buyer')
    .deepPopulate('artwork.review')
    .session(session);
};

export const fetchSoldOrders = async ({ userId, session = null }) => {
  return await User.findOne({
    _id: userId,
  }).deepPopulate('sales.buyer sales.version sales.review');
};

export const fetchBoughtOrders = async ({ userId, session = null }) => {
  return await User.findOne({
    _id: userId,
  }).deepPopulate('purchases.seller purchases.version purchases.review');
};

export const addOrderReview = async ({
  orderId,
  userId,
  reviewId,
  session = null,
}) => {
  return await Order.updateOne(
    {
      $and: [{ _id: orderId }, { buyer: userId }],
    },
    { review: reviewId }
  ).session(session);
};

export const fetchOrdersBySeller = async ({
  userId,
  from,
  to,
  session = null,
}) => {
  return from && to
    ? await Order.find({
        $and: [
          { seller: userId },
          { created: { $gte: new Date(from), $lt: new Date(to) } },
        ],
      }).populate('review version licenses sales.review')
    : await Order.find({
        $and: [{ seller: userId }],
      }).populate('review version licenses sales.review');
};

export const fetchOrdersByBuyer = async ({
  userId,
  from,
  to,
  session = null,
}) => {
  return from && to
    ? await Order.find({
        $and: [
          { buyer: userId },
          { created: { $gte: new Date(from), $lt: new Date(to) } },
        ],
      }).populate('review version licenses sales.review')
    : await Order.find({
        $and: [{ buyer: userId }],
      }).populate('review version licenses sales.review');
};
