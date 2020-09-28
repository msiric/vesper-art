import createError from "http-errors";
import socketApi from "../lib/socket.js";
import { addArtworkReview } from "../services/artwork.js";
import { addNewNotification } from "../services/notification.js";
import { addOrderReview, fetchUserOrder } from "../services/order.js";
import { addNewReview } from "../services/review.js";
import { editUserRating } from "../services/user.js";
import { sanitizeData } from "../utils/helpers.js";
import reviewValidator from "../validation/review.js";
import currency from "currency.js";

// needs transaction (done)
export const postReview = async ({
  userId,
  reviewRating,
  orderId,
  session,
}) => {
  const { error } = reviewValidator(sanitizeData({ reviewRating }));
  if (error) throw createError(400, error);
  if (reviewRating) {
    const foundOrder = await fetchUserOrder({
      orderId,
      userId,
      session,
    });
    if (foundOrder) {
      if (!foundOrder.artwork.review) {
        const savedReview = await addNewReview({
          orderData: foundOrder,
          userId,
          reviewRating,
          session,
        });
        const numerator = currency(savedReview.rating).subtract(
          foundOrder.buyer.rating
        );
        const denominator = currency(foundOrder.buyer.reviews).add(1);
        const newRating = currency(numerator)
          .divide(denominator)
          .add(foundOrder.buyer.rating);
        await editUserRating({
          userId: foundOrder.seller._id,
          userRating: newRating.intValue,
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
          notificationType: "review",
          notificationReceiver: foundOrder.seller,
          session,
        });
        socketApi.sendNotification(foundOrder.seller, foundOrder._id);
        // new end
        return { message: "Review successfully published" };
      }
      throw createError(400, "Review already exists for this artwork");
    }
    throw createError(400, "Review cannot be posted for unbought artwork");
  }
  throw createError(400, "Rating is required");
};
