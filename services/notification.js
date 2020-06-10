import mongoose from 'mongoose';
import Notification from '../models/notification.js';

export const addNewNotification = async ({
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

export const editReadNotification = async ({
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

export const editUnreadNotification = async ({
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
