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
        console.log("buyerRating", foundOrder.buyer);
        console.log("buyerRating", foundOrder.seller.rating);
        console.log("buyerReviews", foundOrder.seller.reviews);
        console.log("reviewRating", reviewRating);

        const numerator = currency(foundOrder.seller.rating)
          .multiply(foundOrder.seller.reviews)
          .add(reviewRating);
        console.log("numerator", numerator);
        const denominator = currency(foundOrder.seller.reviews).add(1);
        console.log("denominator", denominator);

        const newRating = currency(numerator).divide(denominator);
        console.log("newRating", newRating);

        await editUserRating({
          userId: foundOrder.seller._id,
          userRating: newRating.value,
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
