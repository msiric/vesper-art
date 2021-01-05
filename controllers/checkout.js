import crypto from "crypto";
import createError from "http-errors";
import { licenseValidation, orderValidation } from "../common/validation";
import socketApi from "../lib/socket.js";
import License from "../models/license.js";
import { fetchVersionDetails } from "../services/postgres/artwork.js";
import { addNewNotification } from "../services/postgres/notification.js";
import { addNewOrder } from "../services/postgres/order.js";
import { fetchUserById } from "../services/postgres/user.js";
import { generateUuids, sanitizeData } from "../utils/helpers.js";

export const getCheckout = async ({ userId, versionId, connection }) => {
  const foundVersion = await fetchVersionDetails({ versionId, connection });
  if (foundVersion && foundVersion.artwork.active) {
    return {
      version: foundVersion,
    };
  }
  throw createError(400, "Artwork not found");
};

// $TODO not good
export const postDownload = async ({
  userId,
  versionId,
  licenseAssignee,
  licenseCompany,
  licenseType,
  connection,
}) => {
  const foundVersion = await fetchVersionDetails({ versionId, connection });
  if (foundVersion && foundVersion.artwork.active) {
    // $TODO Bolje sredit validaciju licence
    const licensePrice =
      licenseType === "personal"
        ? foundVersion.personal
        : licenseType === "commercial"
        ? foundVersion.commercial
        : -1;
    if (licensePrice !== -1) {
      if (licensePrice === 0) {
        // $TODO Treba li dohvacat usera?
        const foundUser = await fetchUserById({ userId, connection });
        if (!foundVersion.artwork.owner.id === foundUser.id) {
          if (foundUser && foundUser.active) {
            await licenseValidation.validate(
              sanitizeData({
                licenseOwner: foundUser.id,
                licenseArtwork: foundVersion.artwork.id,
                licenseAssignee,
                licenseCompany,
                licenseType,
                licensePrice,
              })
            );
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
            await orderValidation.validate(
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
            const { orderId, notificationId } = generateUuids({
              orderId: null,
              notificationId: null,
            });
            const savedOrder = await addNewOrder({
              orderId,
              orderData: orderObject,
              connection,
            });
            // new start
            await addNewNotification({
              notificationId,
              notificationLink: savedOrder.id,
              notificationRef: "",
              notificationType: "order",
              notificationReceiver: foundVersion.artwork.owner.id,
              connection,
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
