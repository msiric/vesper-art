import mongoose from 'mongoose';
import Order from '../models/order.js';
import User from '../models/user.js';
import License from '../models/license.js';
import Notification from '../models/notification.js';
import createError from 'http-errors';
import crypto from 'crypto';

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

export const createOrderReview = async ({
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
