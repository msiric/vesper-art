import mongoose from 'mongoose';
import Notification from '../models/notification.js';
import createError from 'http-errors';

export const getNotifications = async ({ userId }) => {
  return await Notification.find({
    receivers: { $elemMatch: { user: userId } },
  })
    .populate('user')
    .sort({ created: -1 });
};

export const readNotification = async ({ userId, notificationId }) => {
  return await Notification.updateOne(
    {
      $and: [
        {
          _id: notificationId,
        },
        { receiver: userId },
      ],
    },
    { read: true }
  ).session(session);
};

export const unreadNotification = async ({ userId, notificationId }) => {
  return await Notification.updateOne(
    {
      $and: [
        {
          _id: notificationId,
        },
        { receiver: userId },
      ],
    },
    { read: false }
  ).session(session);
};
