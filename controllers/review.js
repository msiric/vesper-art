import mongoose from 'mongoose';
import createError from 'http-errors';
import socketApi from '../realtime/io.js';
import { fetchUserOrder, addOrderReview } from '../services/order.js';
import { addArtworkReview } from '../services/artwork.js';
import { addNewNotification } from '../services/notification.js';
import { editUserRating } from '../services/user.js';

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
          await editUserRating({
            userId: foundOrder.seller._id,
            userRating: newRating,
            session,
          });
          await addOrderReview({
            orderId,
            userId: res.locals.user.id,
            reviewId: savedReview._id,
            session,
          });
          await addArtworkReview({
            artworkId: foundOrder.artwork._id,
            reviewId: savedReview._id,
            session,
          });
          // new start
          await addNewNotification({
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
