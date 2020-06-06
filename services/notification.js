import mongoose from 'mongoose';
import Notification from '../models/notification.js';
import createError from 'http-errors';

export const getNotifications = async () => {
  return await Notification.find({
    receivers: { $elemMatch: { user: res.locals.user.id } },
  })
    .populate('user')
    .sort({ created: -1 });
};

export const readNotification = async ({ notificationId }) => {
  return await Notification.updateOne(
    {
      $and: [
        {
          _id: notificationId,
        },
        { receiver: res.locals.user.id },
      ],
    },
    { read: true }
  ).session(session);
};

export const unreadNotification = async ({ notificationId }) => {
  return await Notification.updateOne(
    {
      $and: [
        {
          _id: notificationId,
        },
        { receiver: res.locals.user.id },
      ],
    },
    { read: false }
  ).session(session);
};
