import mongoose from 'mongoose';
import Review from '../models/review.js';
import Notification from '../models/notification.js';
import Order from '../models/order.js';
import Artwork from '../models/artwork.js';
import User from '../models/user.js';
import createError from 'http-errors';
import socketApi from '../realtime/io.js';
import { fetchUserOrder, createOrderReview } from '../services/order.js';
import { updateUserRating } from '../services/user.js';
import { createArtworkReview } from '../services/artwork.js';
import { createNewNotification } from '../services/notification.js';

// needs transaction (done)
const postReview = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { reviewRating, reviewContent } = req.body;
    const { orderId } = req.params;
    if (reviewRating) {
      const foundOrder = await fetchUserOrder({
        orderId,
        userId: res.locals.user.id,
        session,
      });
      if (foundOrder) {
        if (!foundOrder.artwork.review) {
          const savedReview = await postNewReview({
            orderData: foundOrder,
            userId: res.locals.user.id,
            reviewRating,
            reviewContent,
            session,
          });
          const newRating =
            foundOrder.buyer.rating +
            (
              (newReview.rating - foundOrder.buyer.rating) /
              (foundOrder.buyer.reviews + 1)
            ).toFixed(2);
          await updateUserRating({
            userId: foundOrder.seller._id,
            userRating: newRating,
            session,
          });
          await createOrderReview({
            orderId,
            userId: res.locals.user.id,
            reviewId: savedReview._id,
            session,
          });
          await createArtworkReview({
            artworkId: foundOrder.artwork._id,
            reviewId: savedReview._id,
            session,
          });
          // new start
          await createNewNotification({
            notificationLink: foundOrder._id,
            notificationType: 'Review',
            notificationReceiver: foundOrder.seller,
            session,
          });
          socketApi.sendNotification(foundOrder.seller, foundOrder._id);
          // new end
          await session.commitTransaction();
          return res.status(200).json('Review successfully published');
        } else {
          throw createError(400, 'Review already exists for this artwork');
        }
      } else {
        throw createError(400, 'Review cannot be posted for unbought artwork');
      }
    } else {
      throw createError(400, 'Rating is required');
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
  postReview,
};
