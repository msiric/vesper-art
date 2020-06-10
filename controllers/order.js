import mongoose from 'mongoose';
import { fetchOrderDetails } from '../services/order.js';
import { fetchUserSales, fetchUserPurchases } from '../services/user.js';
import createError from 'http-errors';
import crypto from 'crypto';

const getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const foundOrder = await fetchOrderDetails({
      userId: res.locals.user.id,
      orderId,
    });
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
      res.json({
        order: foundOrder,
      });
    } else {
      throw createError(400, 'Order not found');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getSoldOrders = async (req, res, next) => {
  try {
    const foundUser = await fetchUserSales({ userId: res.locals.user.id });
    res.json({ sales: foundUser.sales });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const getBoughtOrders = async (req, res, next) => {
  try {
    const foundUser = await await fetchUserPurchases({
      userId: res.locals.user.id,
    });
    res.json({ purchases: foundUser.purchases });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

export default {
  getOrderDetails,
  getSoldOrders,
  getBoughtOrders,
};
