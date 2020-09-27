import createError from "http-errors";
import { fetchOrderDetails } from "../services/order.js";
import { fetchUserPurchases, fetchUserSales } from "../services/user.js";
import aws from "aws-sdk";

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ID,
  region: process.env.S3_REGION,
});

export const getSoldOrders = async ({ userId }) => {
  const foundUser = await fetchUserSales({ userId });
  return { sales: foundUser.sales };
};

export const getBoughtOrders = async ({ userId }) => {
  const foundUser = await fetchUserPurchases({ userId });
  return { purchases: foundUser.purchases };
};

export const getOrderDetails = async ({ userId, orderId }) => {
  const foundOrder = await fetchOrderDetails({
    userId,
    orderId,
  });
  if (foundOrder) {
    // let decreaseNotif = false;
    // notif
    // if (req.query.ref) {
    //   const foundNotif = await Notification.findById({
    //     _id: req.query.ref,
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
    //           _id: res.locals.user.id,
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
  throw createError(400, "Order not found");
};

export const downloadOrderArtwork = async ({ userId, orderId }) => {
  const foundOrder = await fetchOrderDetails({
    userId,
    orderId,
  });
  if (foundOrder) {
    const s3 = new aws.S3({ signatureVersion: "v4" });

    const file = foundOrder.version.media.split("/").pop();
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `artworkMedia/${file}`,
      Expires: 60 * 3,
    };
    const url = s3.getSignedUrl("getObject", params);

    return { url, file };
  }
  throw createError(400, "Artwork not found");
};
