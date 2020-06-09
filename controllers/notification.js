import mongoose from 'mongoose';
import Notification from '../models/notification.js';
import {
  fetchExistingNotifications,
  updateReadNotification,
  updateUnreadNotification,
} from '../services/notification.js';
import createError from 'http-errors';

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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { notificationId } = req.params;
    await updateReadNotification({
      userId: res.locals.user.id,
      notificationId,
    });
    await session.commitTransaction();
    res.json({ message: 'Notification read' });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

const unreadNotification = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { notificationId } = req.params;
    await updateUnreadNotification({
      userId: res.locals.user.id,
      notificationId,
    });
    await session.commitTransaction();
    res.json({ message: 'Notification read' });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

export default {
  getNotifications,
  readNotification,
  unreadNotification,
};
