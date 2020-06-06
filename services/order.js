import mongoose from 'mongoose';
import Order from '../models/order.js';
import User from '../models/user.js';
import License from '../models/license.js';
import Notification from '../models/notification.js';
import createError from 'http-errors';
import crypto from 'crypto';

export const getOrderDetails = async ({ orderId }) => {
  return await Order.findOne({
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
};

export const getSoldOrders = async () => {
  return await User.findOne({
    _id: res.locals.user.id,
  }).deepPopulate('sales.buyer sales.version sales.review');
};

export const getBoughtOrders = async () => {
  return await User.findOne({
    _id: res.locals.user.id,
  }).deepPopulate('purchases.seller purchases.version purchases.review');
};
