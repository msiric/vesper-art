import mongoose from 'mongoose';
import Notification from '../models/notification.js';
import createError from 'http-errors';

const getNotifications = async (req, res, next) => {
  try {
    const foundNotifications = await Notification.find({
      receivers: { $elemMatch: { user: res.locals.user.id } },
    })
      .populate('user')
      .sort({ created: -1 });
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
    const foundNotification = await Notification.findOne({
      $and: [
        {
          _id: notificationId,
        },
        { receiver: res.locals.user.id },
      ],
    }).session(session);
    if (foundNotification) {
      foundNotification.read = true;
      await foundNotification.save({ session });
      await session.commitTransaction();
      res.json({ message: 'Notification read' });
    } else {
      throw createError(400, 'Notification not found');
    }
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
    const foundNotification = await Notification.findOne({
      $and: [
        {
          _id: notificationId,
        },
        { receiver: res.locals.user.id },
      ],
    }).session(session);
    if (foundNotification) {
      foundNotification.read = false;
      await foundNotification.save({ session });
      await session.commitTransaction();
      res.json({ message: 'Notification read' });
    } else {
      throw createError(400, 'Notification not found');
    }
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
