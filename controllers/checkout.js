import crypto from "crypto";
import createError from "http-errors";
import socketApi from "../lib/socket.js";
import License from "../models/license.js";
import { fetchVersionDetails } from "../services/postgres/artwork.js";
import { addNewNotification } from "../services/postgres/notification.js";
import { addNewOrder } from "../services/postgres/order.js";
import {
  editUserPurchase,
  editUserSale,
  fetchUserById,
} from "../services/postgres/user.js";
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
        if (!foundVersion.artwork.owner.id === foundUser.id) {
          if (foundUser && foundUser.active) {
            const { licenseError } = licenseValidator(
              sanitizeData({
                licenseOwner: foundUser.id,
                licenseArtwork: foundVersion.artwork.id,
                licenseAssignee,
                licenseCompany,
                licenseType,
                licensePrice,
              })
            );
            if (licenseError) throw createError(400, licenseError);
            const newLicense = new License();
            newLicense.owner = foundUser.id;
            newLicense.artwork = foundVersion.artwork.id;
            newLicense.fingerprint = crypto.randomBytes(20).toString("hex");
            newLicense.assignee = licenseAssignee;
            newLicense.company = licenseCompany;
            newLicense.type = licenseType;
            newLicense.active = true;
            newLicense.price = licensePrice;
            const savedLicense = await License.save(newLicense);
            const { orderError } = orderValidator(
              sanitizeData({
                orderBuyer: foundUser.id,
                orderSeller: foundVersion.artwork.owner.id,
                orderArtwork: foundVersion.artwork.id,
                orderVersion: foundVersion.id,
                orderDiscount: null,
                orderLicense: savedLicense.id,
                orderSpent: 0,
                orderEarned: 0,
                orderFee: 0,
                orderIntent: null,
              })
            );
            if (orderError) throw createError(400, orderError);
            const orderObject = {
              buyerId: foundUser.id,
              sellerId: foundVersion.artwork.owner.id,
              artworkId: foundVersion.artwork.id,
              versionId: foundVersion.id,
              discountId: null,
              licenseId: savedLicense.id,
              review: null,
              spent: 0,
              earned: 0,
              fee: 0,
              type: "free",
              status: "completed",
              intentId: null,
            };
            const savedOrder = await addNewOrder({
              orderData: orderObject,
              session,
            });
            await editUserPurchase({
              userId: foundUser.id,
              orderId: savedOrder.id,
              session,
            });
            await editUserSale({
              userId: foundVersion.artwork.owner.id,
              orderId: savedOrder.id,
              session,
            });
            // new start
            await addNewNotification({
              notificationLink: savedOrder.id,
              notificationRef: "",
              notificationType: "order",
              notificationReceiver: foundVersion.artwork.owner.id,
              session,
            });
            socketApi.sendNotification(
              foundVersion.artwork.owner.id,
              savedOrder.id
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
