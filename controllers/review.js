import createError from "http-errors";
import { reviewValidation } from "../common/validation";
import socketApi from "../lib/socket.js";
import { addNewNotification } from "../services/postgres/notification.js";
import {
  addOrderReview,
  fetchUserPurchase,
} from "../services/postgres/order.js";
import { addNewReview } from "../services/postgres/review.js";
import { generateUuids, sanitizeData } from "../utils/helpers.js";

// needs transaction (done)
export const postReview = async ({ userId, reviewRating, orderId }) => {
  const { error } = await reviewValidation.validate(
    sanitizeData({ reviewRating })
  );
  if (error) throw createError(400, error);
  if (reviewRating) {
    const foundOrder = await fetchUserPurchase({
      orderId,
      userId,
    });
    if (foundOrder) {
      if (!foundOrder.artwork.review) {
        const { reviewId } = generateUuids({
          reviewId: null,
        });
        // $TODO should this be saved or just returned?
        const savedReview = await addNewReview({
          reviewId,
          orderData: foundOrder,
          reviewerId: userId,
          revieweeId: foundOrder.seller,
          reviewRating,
        });
        /*         const numerator = currency(foundOrder.seller.rating)
          .multiply(foundOrder.seller.reviews)
          .add(reviewRating);
        const denominator = currency(foundOrder.seller.reviews).add(1);
        const newRating = currency(numerator).divide(denominator); */
        const updatedOrder = await addOrderReview({
          savedReview,
          orderId,
          userId,
        });
        const { notificationId } = generateUuids({
          notificationId: null,
        });
        // new start
        await addNewNotification({
          notificationId,
          notificationLink: foundOrder.id,
          notificationRef: savedReview.id,
          notificationType: "review",
          notificationReceiver: foundOrder.seller,
        });
        socketApi.sendNotification(foundOrder.seller, foundOrder.id);
        // new end
        return { message: "Review successfully published" };
      }
      throw createError(400, "Review already exists for this artwork");
    }
    throw createError(400, "Review cannot be posted for unbought artwork");
  }
  throw createError(400, "Rating is required");
};
