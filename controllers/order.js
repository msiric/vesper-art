import createError from "http-errors";
import { isObjectEmpty } from "../common/helpers";
import { getSignedS3Object } from "../lib/s3";
import { fetchOrderDetails, fetchOrderMedia } from "../services/postgres/order";
import {
  fetchArtworkOrders,
  fetchUserPurchases,
  fetchUserSales,
} from "../services/postgres/user";
import { formatError } from "../utils/helpers";
import { errors } from "../utils/statuses";

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
    // let decreaseNotif = false;
    // notif
    // if (req.query.ref) {
    //   const foundNotif = await Notification.findById({
    //     id: req.query.ref,
    //   }).session(session);
    //   if (foundNotif) {
    //     let changed = false;
    //     foundNotif.receivers.forEach(function (receiver) {
    //       if (receiver.user.equals(res.locals.user.id)) {
    //         if (receiver.read === false) {
    //           receiver.read = true;
    //           changed = true;
    //         }
    //       }
    //     });
    //     if (changed) {
    //       await foundNotif.save({ session });
    //       await User.updateOne(
    //         {
    //           id: res.locals.user.id,
    //         },
    //         { $inc: { notifications: -1 } },
    //         { useFindAndModify: false }
    //       ).session(session);
    //       decreaseNotif = true;
    //     }
    //   }
    // }
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
