import Notification from "../../models/notification";
import User from "../../models/user";

export const addNewNotification = async ({
  notificationLink,
  notificationRef,
  notificationType,
  notificationReceiver,
  session = null,
}) => {
  const newNotification = new Notification();
  newNotification.link = notificationLink;
  newNotification.ref = notificationRef;
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
          id: notificationId,
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
          id: notificationId,
        },
        { receiver: userId },
      ],
    },
    { read: false }
  ).session(session);
};

export const decrementUserNotification = async ({ userId, session = null }) => {
  return await User.updateOne(
    { id: userId },
    { $inc: { notifications: -1 } }
  ).session(session);
};

export const incrementUserNotification = async ({ userId, session = null }) => {
  return await User.updateOne(
    { id: userId },
    { $inc: { notifications: 1 } }
  ).session(session);
};
