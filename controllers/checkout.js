import createError from "http-errors";
import {
  formatLicenseValues,
  isLicenseValid,
  isObjectEmpty,
  renderFreeLicenses,
} from "../common/helpers";
import {
  actorsValidation,
  freeValidation,
  licenseValidation,
  orderValidation,
} from "../common/validation";
import socketApi from "../lib/socket";
import { fetchVersionDetails } from "../services/artwork";
import { addNewNotification } from "../services/notification";
import { addNewOrder, fetchArtworkOrders } from "../services/order";
import { fetchUserById } from "../services/user";
import { addNewLicense } from "../services/verifier";
import { USER_SELECTION } from "../utils/database";
import { formatError, formatResponse, generateUuids } from "../utils/helpers";
import { errors, responses } from "../utils/statuses";

export const getCheckout = async ({ userId, versionId, connection }) => {
  const foundVersion = await fetchVersionDetails({
    versionId,
    connection,
  });
  if (!isObjectEmpty(foundVersion)) {
    if (foundVersion.id === foundVersion.artwork.currentId) {
      if (foundVersion.artwork.owner.id !== userId) {
        return {
          version: foundVersion,
        };
      }
      throw createError(...formatError(errors.artworkCheckoutByOwner));
    }
    throw createError(...formatError(errors.artworkVersionObsolete));
  }
  throw createError(...formatError(errors.artworkNotFound));
};

// $TODO Not good
// transaction is not working correctly???
export const postDownload = async ({
  userId,
  versionId,
  licenseUsage,
  licenseCompany,
  licenseType,
  connection,
}) => {
  const foundVersion = await fetchVersionDetails({
    versionId,
    selection: [...USER_SELECTION["LICENSE_INFO"]("owner")],
    connection,
  });
  if (!isObjectEmpty(foundVersion)) {
    const foundUser = await fetchUserById({
      userId,
      selection: [...USER_SELECTION["LICENSE_INFO"]()],
      connection,
    });
    if (!isObjectEmpty(foundUser)) {
      const licensePrice = foundVersion[licenseType];
      const licenseData = formatLicenseValues({
        licenseAssignee: foundUser.fullName,
        licenseAssignor: foundVersion.artwork.owner.fullName,
        licenseUsage,
        licenseCompany,
        licenseType,
        licensePrice,
      });
      await licenseValidation
        .concat(actorsValidation)
        .concat(freeValidation)
        .validate(licenseData);
      const availableLicenses = renderFreeLicenses({
        version: foundVersion,
      });
      if (availableLicenses.some((item) => item.value === licenseType)) {
        if (foundVersion.id === foundVersion.artwork.currentId) {
          const foundOrders = await fetchArtworkOrders({
            userId,
            artworkId: foundVersion.artwork.id,
            connection,
          });
          const licenseStatus = isLicenseValid({
            data: licenseData,
            orders: foundOrders,
          });
          if (licenseStatus.valid) {
            if (foundVersion.artwork.owner.id !== foundUser.id) {
              const { licenseId, orderId, notificationId } = generateUuids({
                licenseId: null,
                orderId: null,
                notificationId: null,
              });
              await addNewLicense({
                licenseId,
                userId: foundUser.id,
                sellerId: foundVersion.artwork.owner.id,
                artworkId: foundVersion.artwork.id,
                licenseData,
                connection,
              });
              await orderValidation.validate({
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
              await addNewNotification({
                notificationId,
                notificationLink: orderId,
                notificationRef: "",
                notificationType: "order",
                notificationReceiver: foundVersion.artwork.owner.id,
                connection,
              });
              socketApi.sendNotification(
                foundVersion.artwork.owner.id,
                orderId
              );
              return formatResponse(responses.orderCreated);
            }
            throw createError(...formatError(errors.artworkDownloadedByOwner));
          }
          throw createError(
            ...formatError(errors[licenseStatus.state.identifier])
          );
        }
        throw createError(...formatError(errors.artworkVersionObsolete));
      }
      throw createError(...formatError(errors.artworkLicenseInvalid));
    }
    throw createError(...formatError(errors.userNotFound));
  }
  throw createError(...formatError(errors.artworkNotFound));
};
