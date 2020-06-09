import mongoose from 'mongoose';
import Notification from '../models/notification.js';
import createError from 'http-errors';

export const createNewNotification = async ({
  notificationLink,
  notificationType,
  notificationReceiver,
  session = null,
}) => {
  const newNotification = new Notification();
  newNotification.link = notificationLink;
  newNotification.type = notificationType;
  newNotification.receiver = notificationReceiver;
  newNotification.read = false;
  return await newNotification.save({ session });
};

export const fetchExistingNotifications = async ({
  userId,
  session = null,
}) => {
  return await Notification.find({
    receiver: userId,
  }).sort({ created: -1 });
};

export const updateReadNotification = async ({
  userId,
  notificationId,
  session = null,
}) => {
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

export const updateUnreadNotification = async ({
  userId,
  notificationId,
  session = null,
}) => {
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
