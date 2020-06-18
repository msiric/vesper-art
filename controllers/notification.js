import mongoose from 'mongoose';
import {
  fetchExistingNotifications,
  editReadNotification,
  editUnreadNotification,
} from '../services/notification.js';

const getNotifications = async ({ userId }) => {
  const foundNotifications = await fetchExistingNotifications({
    userId,
  });
  return { notification: foundNotifications };
};

const readNotification = async ({ userId, notificationId }) => {
  await editReadNotification({
    userId,
    notificationId,
  });
  return { message: 'Notification read' };
};

const unreadNotification = async ({ userId, notificationId }) => {
  await editUnreadNotification({
    userId,
    notificationId,
  });
  return { message: 'Notification read' };
};

export default {
  getNotifications,
  readNotification,
  unreadNotification,
};
