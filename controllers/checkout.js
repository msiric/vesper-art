import createError from "http-errors";
import { downloadValidation, licenseValidation } from "../common/validation";
import socketApi from "../lib/socket.js";
import { fetchVersionDetails } from "../services/postgres/artwork.js";
import { addNewLicense } from "../services/postgres/license";
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
// transaction is not working correctly???
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
    // $TODO Sredit validnu licencu (npr, ako je "use": "included", ne moze bit odabran personal license)
    await licenseValidation.validate(
      sanitizeData({
        licenseAssignee,
        licenseCompany,
        licenseType,
      })
    );
    // $TODO Check if artwork is free, and validate license and version correctly
    const licensePrice = foundVersion[licenseType];
    // $TODO Treba li dohvacat usera?
    const foundUser = await fetchUserById({ userId, connection });
    if (foundVersion.artwork.active) {
      if (foundVersion.id === foundVersion.artwork.currentId) {
        if (foundVersion.artwork.owner.id !== foundUser.id) {
          if (foundUser && foundUser.active) {
            const { licenseId, orderId, notificationId } = generateUuids({
              licenseId: null,
              orderId: null,
              notificationId: null,
            });
            const savedLicense = await addNewLicense({
              licenseId,
              userId: foundUser.id,
              artworkId: foundVersion.artwork.id,
              licenseData: {
                licenseAssignee,
                licenseCompany,
                licenseType,
                licensePrice,
              },
              connection,
            });
            await downloadValidation.validate(
              sanitizeData({
                orderBuyer: foundUser.id,
                orderSeller: foundVersion.artwork.owner.id,
                orderArtwork: foundVersion.artwork.id,
                orderVersion: foundVersion.id,
                orderDiscount: null,
                orderLicense: licenseId,
                orderSpent: 0,
                orderEarned: 0,
                orderFee: 0,
              })
            );
            const orderObject = {
              buyerId: foundUser.id,
              sellerId: foundVersion.artwork.owner.id,
              artworkId: foundVersion.artwork.id,
              versionId: foundVersion.id,
              discountId: null,
              licenseId,
              review: null,
              spent: 0,
              earned: 0,
              fee: 0,
              type: "free",
              status: "completed",
              intentId: null,
            };
            const savedOrder = await addNewOrder({
              orderId,
              orderData: orderObject,
              connection,
            });
            // new start
            await addNewNotification({
              notificationId,
              notificationLink: orderId,
              notificationRef: "",
              notificationType: "order",
              notificationReceiver: foundVersion.artwork.owner.id,
              connection,
            });
            socketApi.sendNotification(foundVersion.artwork.owner.id, orderId);
            // new end
            return { message: "Order completed successfully" };
          }
          throw createError(400, "User not found");
        }
        throw createError(400, "You are the owner of this artwork");
      }
      throw createError(400, "Artwork version is obsolete");
    }
    throw createError(400, "Artwork is no longer active");
  }
  throw createError(400, "Artwork not found");
};
