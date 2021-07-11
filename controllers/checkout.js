import createError from "http-errors";
import { renderFreeLicenses } from "../common/helpers";
import { downloadValidation, licenseValidation } from "../common/validation";
import socketApi from "../lib/socket";
import { fetchVersionDetails } from "../services/postgres/artwork";
import { addNewLicense } from "../services/postgres/license";
import { addNewNotification } from "../services/postgres/notification";
import { addNewOrder } from "../services/postgres/order";
import { fetchUserById } from "../services/postgres/user";
import { formatError, formatResponse, generateUuids } from "../utils/helpers";
import { errors, responses } from "../utils/statuses";

export const getCheckout = async ({ userId, versionId, connection }) => {
  const foundVersion = await fetchVersionDetails({ versionId, connection });
  if (foundVersion && foundVersion.artwork.active) {
    return {
      version: foundVersion,
    };
  }
  throw createError(...formatError(errors.artworkNotFound));
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
  if (foundVersion) {
    await licenseValidation.validate({
      licenseAssignee,
      licenseCompany,
      licenseType,
    });
    const availableLicenses = renderFreeLicenses({
      version: foundVersion,
    });
    if (availableLicenses.some((item) => item.value === licenseType)) {
      const licensePrice = foundVersion[licenseType];
      // $TODO Treba li dohvacat usera?
      const foundUser = await fetchUserById({ userId, connection });
      if (foundUser) {
        if (foundVersion.id === foundVersion.artwork.currentId) {
          if (foundVersion.artwork.owner.id !== foundUser.id) {
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
            await downloadValidation.validate({
              orderBuyer: foundUser.id,
              orderSeller: foundVersion.artwork.owner.id,
              orderArtwork: foundVersion.artwork.id,
              orderVersion: foundVersion.id,
              orderDiscount: null,
              orderLicense: licenseId,
              orderSpent: 0,
              orderEarned: 0,
              orderFee: 0,
            });
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
            return formatResponse(responses.orderCreated);
          }
          throw createError(...formatError(errors.artworkDownloadedByOwner));
        }
        throw createError(...formatError(errors.artworkVersionObsolete));
      }
      throw createError(...formatError(errors.userNotFound));
    }
    throw createError(...formatError(errors.artworkLicenseInvalid));
  }
  throw createError(...formatError(errors.artworkNotFound));
};
