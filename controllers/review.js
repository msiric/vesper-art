import mongoose from 'mongoose';
import createError from 'http-errors';
import socketApi from '../realtime/io.js';
import { fetchUserOrder, addOrderReview } from '../services/order.js';
import { addArtworkReview } from '../services/artwork.js';
import { addNewNotification } from '../services/notification.js';
import { editUserRating } from '../services/user.js';
import reviewValidator from '../utils/validation/review.js';
import { sanitizeData } from '../utils/helpers.js';

// needs transaction (done)
const postReview = async ({ userId, reviewRating, reviewContent, orderId }) => {
  const { error } = reviewValidator(
    sanitizeData({ reviewRating, reviewContent })
  );
  if (error) throw createError(400, error);
  if (reviewRating) {
    const foundOrder = await fetchUserOrder({
      orderId,
      userId,
      session,
    });
    if (foundOrder) {
      if (!foundOrder.artwork.review) {
        const savedReview = await postNewReview({
          orderData: foundOrder,
          userId,
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
          reviewId: savedReview._id,
          orderId,
          userId,
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
          notificationType: 'review',
          notificationReceiver: foundOrder.seller,
          session,
        });
        socketApi.sendNotification(foundOrder.seller, foundOrder._id);
        // new end
        return { message: 'Review successfully published' };
      }
      throw createError(400, 'Review already exists for this artwork');
    }
    throw createError(400, 'Review cannot be posted for unbought artwork');
  }
  throw createError(400, 'Rating is required');
};

export default {
  postReview,
};
