import createError from "http-errors";
import { isObjectEmpty } from "../common/helpers";
import { reviewValidation } from "../common/validation";
import socketApi from "../lib/socket";
import { addNewNotification } from "../services/postgres/notification";
import { addOrderReview, fetchUserPurchase } from "../services/postgres/order";
import { addNewReview } from "../services/postgres/review";
import { formatError, formatResponse, generateUuids } from "../utils/helpers";
import { errors, responses } from "../utils/statuses";

// needs transaction (done)
export const postReview = async ({
  userId,
  reviewRating,
  orderId,
  connection,
}) => {
  await reviewValidation.validate({ reviewRating });
  const foundOrder = await fetchUserPurchase({
    orderId,
    userId,
    connection,
  });
  if (foundOrder) {
    if (isObjectEmpty(foundOrder.review)) {
      const { reviewId, notificationId } = generateUuids({
        reviewId: null,
        notificationId: null,
      });
      // $TODO should this be saved or just returned?
      const savedReview = await addNewReview({
        reviewId,
        orderData: foundOrder,
        reviewerId: userId,
        revieweeId: foundOrder.sellerId,
        reviewRating,
        connection,
      });
      /*         const numerator = currency(foundOrder.seller.rating)
          .multiply(foundOrder.seller.reviews)
          .add(reviewRating);
        const denominator = currency(foundOrder.seller.reviews).add(1);
        const newRating = currency(numerator).divide(denominator); */
      const updatedOrder = await addOrderReview({
        reviewId,
        orderId,
        userId,
        connection,
      });
      // new start
      await addNewNotification({
        notificationId,
        notificationLink: foundOrder.id,
        notificationRef: reviewId,
        notificationType: "review",
        notificationReceiver: foundOrder.seller,
        connection,
      });
      socketApi.sendNotification(foundOrder.seller, foundOrder.id);
      // new end
      return formatResponse(responses.reviewCreated);
    }
    throw createError(...formatError(errors.reviewAlreadyExists));
  }
  throw createError(...formatError(errors.reviewNotAllowed));
};
