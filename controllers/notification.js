import mongoose from 'mongoose';
import {
  fetchExistingNotifications,
  updateReadNotification,
  updateUnreadNotification,
} from '../services/notification.js';

const getNotifications = async (req, res, next) => {
  try {
    const foundNotifications = await fetchExistingNotifications({
      userId: res.locals.user.id,
    });
    res.json({ notification: foundNotifications });
  } catch (err) {
    next(err, res);
  }
};

const readNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await updateReadNotification({
      userId: res.locals.user.id,
      notificationId,
    });
    res.json({ message: 'Notification read' });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const unreadNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await updateUnreadNotification({
      userId: res.locals.user.id,
      notificationId,
    });
    res.json({ message: 'Notification read' });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

export default {
  getNotifications,
  readNotification,
  unreadNotification,
};
