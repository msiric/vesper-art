import mongoose from "mongoose";
import {
  fetchExistingNotifications,
  editReadNotification,
  editUnreadNotification,
  decrementUserNotification,
  incrementUserNotification,
} from "../services/notification.js";

export const getNotifications = async ({ userId }) => {
  const foundNotifications = await fetchExistingNotifications({
    userId,
  });
  return { notification: foundNotifications };
};

export const readNotification = async ({ userId, notificationId }) => {
  await editReadNotification({
    userId,
    notificationId,
  });
  await decrementUserNotification({ userId });
  return { message: "Notification read" };
};

export const unreadNotification = async ({ userId, notificationId }) => {
  await editUnreadNotification({
    userId,
    notificationId,
  });
  await incrementUserNotification({ userId });
  return { message: "Notification read" };
};
