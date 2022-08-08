import createError from "http-errors";
import { isObjectEmpty } from "../common/helpers";
import { reviewValidation } from "../common/validation";
import { getSignedS3Object } from "../lib/s3";
import socketApi from "../lib/socket";
import { fetchUserFavorites } from "../services/artwork";
import { addNewNotification } from "../services/notification";
import {
  addOrderReview,
  fetchArtworkOrders,
  fetchOrderDetails,
  fetchOrderMedia,
  fetchOrdersByBuyer,
  fetchOrdersBySeller,
  fetchUserPurchase,
  fetchUserPurchases,
  fetchUserReviews,
  fetchUserSales,
} from "../services/order";
import { addNewReview } from "../services/review";
import { fetchStripeBalance } from "../services/stripe";
import { fetchUserById } from "../services/user";
import { formatError, formatResponse, generateUuids } from "../utils/helpers";
import { errors, responses } from "../utils/statuses";

// ovo je test za novi checkout (trenutno delayed)
// $TODO validacija licenci
export const addNewOrder = async ({
  userId,
  versionId,
  /*   discountId, */
  artworkLicense,
  connection,
}) => {
  // $TODO call retrieve paymentintent and create new order
};

export const getSoldOrders = async ({ userId, connection }) => {
  const foundSales = await fetchUserSales({ userId, connection });
  return { sales: foundSales };
};

export const getBoughtOrders = async ({ userId, connection }) => {
  const foundPurchases = await fetchUserPurchases({ userId, connection });
  return { purchases: foundPurchases };
};

export const getBoughtArtwork = async ({ userId, artworkId, connection }) => {
  const foundPurchases = await fetchArtworkOrders({
    userId,
    artworkId,
    connection,
  });
  return { purchases: foundPurchases };
};

export const getOrderDetails = async ({ userId, orderId, connection }) => {
  const foundOrder = await fetchOrderDetails({
    userId,
    orderId,
    connection,
  });
  if (!isObjectEmpty(foundOrder)) {
    return { order: foundOrder };
  }
  throw createError(...formatError(errors.orderNotFound));
};

export const getOrderMedia = async ({ userId, orderId, connection }) => {
  const foundMedia = await fetchOrderMedia({
    userId,
    orderId,
    connection,
  });
  if (!isObjectEmpty(foundMedia)) {
    const { url, file } = await getSignedS3Object({
      fileLink: foundMedia.source,
      folderName: "artworkMedia/",
    });
    return { url, file };
  }
  throw createError(...formatError(errors.artworkNotFound));
};

// $TODO ne valja nista
export const getBuyerStatistics = async ({ userId, connection }) => {
  // brisanje accounta
  /*     stripe.accounts.del('acct_1Gi3zvL1KEMAcOES', function (err, confirmation) {
    }); */
  const [foundUser, foundFavorites, foundPurchases] = await Promise.all([
    fetchUserById({ userId, connection }),
    fetchUserFavorites({ userId, connection }),
    fetchUserPurchases({ userId, connection }),
  ]);
  if (!isObjectEmpty(foundUser)) {
    return {
      purchases: foundPurchases,
      favorites: foundFavorites,
    };
  }
  throw createError(...formatError(errors.userNotFound));
};

export const getSellerStatistics = async ({ userId, connection }) => {
  // brisanje accounta
  /*     stripe.accounts.del('acct_1Gi3zvL1KEMAcOES', function (err, confirmation) {
    }); */
  const [foundUser, foundReviews, foundSales] = await Promise.all([
    fetchUserById({ userId, connection }),
    fetchUserReviews({ userId, connection }),
    fetchUserSales({ userId, connection }),
  ]);
  if (!isObjectEmpty(foundUser)) {
    const balance = await fetchStripeBalance({
      stripeId: foundUser.stripeId,
      connection,
    });
    const { amount } = balance.available[0];
    return { sales: foundSales, amount, reviews: foundReviews };
  }
  throw createError(...formatError(errors.userNotFound));
};

export const getUserSales = async ({ userId, start, end, connection }) => {
  const foundOrders = await fetchOrdersBySeller({
    userId,
    start,
    end,
    connection,
  });
  // $TODO change name
  return { statistics: foundOrders };
};

export const getUserPurchases = async ({ userId, start, end, connection }) => {
  const foundOrders = await fetchOrdersByBuyer({
    userId,
    start,
    end,
    connection,
  });
  // $TODO change name
  return { statistics: foundOrders };
};

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
  if (!isObjectEmpty(foundOrder)) {
    if (!foundOrder.review) {
      const { reviewId, notificationId } = generateUuids({
        reviewId: null,
        notificationId: null,
      });
      // $TODO should this be saved or just returned?
      await addNewReview({
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
      await addOrderReview({
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
        notificationReceiver: foundOrder.sellerId,
        connection,
      });
      socketApi.sendNotification(foundOrder.sellerId, foundOrder.id);
      // new end
      return formatResponse(responses.reviewCreated);
    }
    throw createError(...formatError(errors.reviewAlreadyExists));
  }
  throw createError(...formatError(errors.orderNotFound));
};
