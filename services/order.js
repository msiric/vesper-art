import mongoose from 'mongoose';
import Order from '../models/order.js';
import User from '../models/user.js';
import License from '../models/license.js';
import Notification from '../models/notification.js';
import createError from 'http-errors';
import crypto from 'crypto';

export const getOrderDetails = async ({ userId, orderId }) => {
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

export const getSoldOrders = async ({ userId }) => {
  return await User.findOne({
    _id: userId,
  }).deepPopulate('sales.buyer sales.version sales.review');
};

export const getBoughtOrders = async ({ userId }) => {
  return await User.findOne({
    _id: userId,
  }).deepPopulate('purchases.seller purchases.version purchases.review');
};
