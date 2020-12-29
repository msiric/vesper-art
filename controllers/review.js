import createError from "http-errors";
import socketApi from "../lib/socket.js";
import { addNewNotification } from "../services/postgres/notification.js";
import { addOrderReview, fetchUserOrder } from "../services/postgres/order.js";
import { addNewReview } from "../services/postgres/review.js";
import { addBuyerReview, addSellerReview } from "../services/postgres/user.js";
import { sanitizeData } from "../utils/helpers.js";
import reviewValidator from "../validation/review.js";

// needs transaction (done)
export const postReview = async ({ userId, reviewRating, orderId }) => {
  const { error } = reviewValidator(sanitizeData({ reviewRating }));
  if (error) throw createError(400, error);
  if (reviewRating) {
    const foundOrder = await fetchUserOrder({
      orderId,
      userId,
    });
    if (foundOrder) {
      if (!foundOrder.artwork.review) {
        // $TODO should this be saved or just returned?
        const savedReview = await addNewReview({
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
        const [updatedSeller, updatedBuyer, updatedOrder] = await Promise.all([
          addSellerReview({
            userId: foundOrder.seller.id,
            savedReview,
          }),
          addBuyerReview({
            userId,
            savedReview,
          }),
          addOrderReview({
            savedReview,
            orderId,
            userId,
          }),
        ]);
        // new start
        await addNewNotification({
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
