import crypto from "crypto";
import createError from "http-errors";
import socketApi from "../lib/socket.js";
import License from "../models/license.js";
import { fetchVersionDetails } from "../services/mongo/artwork.js";
import { addNewNotification } from "../services/mongo/notification.js";
import { addNewOrder } from "../services/mongo/order.js";
import {
  editUserPurchase,
  editUserSale,
  fetchUserById,
} from "../services/mongo/user.js";
import { sanitizeData } from "../utils/helpers.js";
import licenseValidator from "../validation/license.js";
import orderValidator from "../validation/order.js";

export const getCheckout = async ({ userId, versionId }) => {
  const foundVersion = await fetchVersionDetails({ versionId });
  if (foundVersion && foundVersion.artwork.active) {
    return {
      version: foundVersion,
    };
  }
  throw createError(400, "Artwork not found");
};

export const postDownload = async ({
  userId,
  versionId,
  licenseAssignee,
  licenseCompany,
  licenseType,
  session,
}) => {
  const foundVersion = await fetchVersionDetails({ versionId });
  if (foundVersion && foundVersion.artwork.active) {
    // $TODO Bolje sredit validaciju licence
    const { intValue: licensePrice } =
      licenseType === "personal"
        ? foundVersion.personal
        : licenseType === "commercial"
        ? foundVersion.commercial
        : -1;
    if (licensePrice !== -1) {
      if (licensePrice === 0) {
        // $TODO Treba li dohvacat usera?
        const foundUser = await fetchUserById({ userId, session });
        if (!foundVersion.artwork.owner._id.equals(foundUser._id)) {
          if (foundUser && foundUser.active) {
            const { licenseError } = licenseValidator(
              sanitizeData({
                licenseOwner: foundUser._id,
                licenseArtwork: foundVersion.artwork._id,
                licenseAssignee,
                licenseCompany,
                licenseType,
                licensePrice,
              })
            );
            if (licenseError) throw createError(400, licenseError);
            const newLicense = new License();
            newLicense.owner = foundUser._id;
            newLicense.artwork = foundVersion.artwork._id;
            newLicense.fingerprint = crypto.randomBytes(20).toString("hex");
            newLicense.assignee = licenseAssignee;
            newLicense.company = licenseCompany;
            newLicense.type = licenseType;
            newLicense.active = true;
            newLicense.price = licensePrice;
            const savedLicense = await newLicense.save({ session });
            const { orderError } = orderValidator(
              sanitizeData({
                orderBuyer: foundUser._id,
                orderSeller: foundVersion.artwork.owner._id,
                orderArtwork: foundVersion.artwork._id,
                orderVersion: foundVersion._id,
                orderDiscount: null,
                orderLicense: savedLicense._id,
                orderSpent: 0,
                orderEarned: 0,
                orderFee: 0,
                orderIntent: null,
              })
            );
            if (orderError) throw createError(400, orderError);
            const orderObject = {
              buyerId: foundUser._id,
              sellerId: foundVersion.artwork.owner._id,
              artworkId: foundVersion.artwork._id,
              versionId: foundVersion._id,
              discountId: null,
              licenseId: savedLicense._id,
              review: null,
              spent: 0,
              earned: 0,
              fee: 0,
              commercial: false,
              status: "completed",
              intentId: null,
            };
            const savedOrder = await addNewOrder({
              orderData: orderObject,
              session,
            });
            await editUserPurchase({
              userId: foundUser._id,
              orderId: savedOrder._id,
              session,
            });
            await editUserSale({
              userId: foundVersion.artwork.owner._id,
              orderId: savedOrder._id,
              session,
            });
            // new start
            await addNewNotification({
              notificationLink: savedOrder._id,
              notificationRef: "",
              notificationType: "order",
              notificationReceiver: foundVersion.artwork.owner._id,
              session,
            });
            socketApi.sendNotification(
              foundVersion.artwork.owner._id,
              savedOrder._id
            );
            // new end
            return { message: "Order completed successfully" };
          }
          throw createError(400, "User not found");
        }
        throw createError(400, "You are the owner of this artwork");
      }
      throw createError(400, "This artwork is not free");
    }
    throw createError(400, "License type is not valid");
  }
  throw createError(400, "Artwork not found");
};
