import mongoose from 'mongoose';
import Notification from '../models/notification.js';
import createError from 'http-errors';

export const createNewNotification = async ({
  notificationLink,
  notificationType,
  notificationReceiver,
}) => {
  const newNotification = new Notification();
  newNotification.link = notificationLink;
  newNotification.type = notificationType;
  newNotification.receiver = notificationReceiver;
  newNotification.read = false;
  return await newNotification.save({ session });
};

export const fetchExistingNotifications = async ({ userId }) => {
  return await Notification.find({
    receiver: userId,
  }).sort({ created: -1 });
};

export const updateReadNotification = async ({ userId, notificationId }) => {
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

export const updateUnreadNotification = async ({ userId, notificationId }) => {
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
