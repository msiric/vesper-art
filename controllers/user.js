import createError from "http-errors";
import { featureFlags } from "../common/constants";
import { isArrayEmpty, isObjectEmpty } from "../common/helpers";
import {
  emailValidation,
  passwordValidation,
  preferencesValidation,
  profileValidation,
} from "../common/validation";
import { renderEmail } from "../emails/template";
import { deleteS3Object } from "../lib/s3";
import {
  deactivateArtworkVersion,
  deactivateExistingArtwork,
  fetchUserMedia,
  removeArtworkVersion,
} from "../services/artwork";
import { logUserOut } from "../services/auth";
import { fetchOrdersByArtwork } from "../services/order";
import { deleteStripeAccount, fetchStripeBalance } from "../services/stripe";
import {
  addNewIntent,
  addUserAvatar,
  deactivateExistingUser,
  editUserAvatar,
  editUserEmail,
  editUserPassword,
  editUserPreferences,
  editUserProfile,
  fetchUserByAuth,
  fetchUserById,
  fetchUserIdByEmail,
  fetchUserIdByUsername,
  fetchUserProfile,
  removeExistingIntent,
  removeUserAvatar,
} from "../services/user";
import { AVATAR_SELECTION, USER_SELECTION } from "../utils/database";
import { formatEmailContent, sendEmail } from "../utils/email";
import {
  formatError,
  formatResponse,
  generateUuids,
  generateVerificationToken,
  hashString,
  verifyHash,
} from "../utils/helpers";
import { STRIPE_BALANCE_TYPES } from "../utils/payment";
import { errors, responses } from "../utils/statuses";
import { finalizeMediaUpload } from "../utils/upload";
import { deleteUserNotifications } from "./notification";

export const getUserProfile = async ({ userUsername, connection }) => {
  const foundId = await fetchUserIdByUsername({
    userUsername,
    connection,
  });
  const foundUser = await fetchUserProfile({
    userUsername,
    userId: foundId,
    connection,
  });
  if (!isObjectEmpty(foundUser)) return { user: foundUser };
  throw createError(...formatError(errors.userNotFound));
};

export const updateUserProfile = async ({
  userId,
  userPath,
  userFilename,
  userMimetype,
  userDescription,
  userCountry,
  connection,
}) => {
  // $TODO Validate data passed to upload
  const avatarUpload = await finalizeMediaUpload({
    filePath: userPath,
    fileName: userFilename,
    mimeType: userMimetype,
    fileType: "user",
  });
  await profileValidation.validate({ userDescription, userCountry });
  const foundUser = await fetchUserById({
    userId,
    selection: [
      ...USER_SELECTION["ESSENTIAL_INFO"](),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"](),
    ],
    connection,
  });
  if (!isObjectEmpty(foundUser)) {
    let avatarId = null;
    if (avatarUpload.fileMedia) {
      if (foundUser.avatar) {
        await deleteS3Object({
          fileLink: foundUser.avatar.source,
          folderName: "userMedia/",
        });
        const updatedAvatar = await editUserAvatar({
          userId: foundUser.id,
          avatarUpload,
          connection,
        });
        avatarId = updatedAvatar.raw[0].id;
      } else {
        ({ avatarId } = generateUuids({
          avatarId: null,
        }));
        await addUserAvatar({
          avatarId,
          userId: foundUser.id,
          avatarUpload,
          connection,
        });
      }
      await editUserProfile({
        foundUser,
        userDescription,
        userCountry,
        avatarId,
        connection,
      });
    } else {
      if (!foundUser.avatar) {
        avatarId = null;
      }
      await editUserProfile({
        foundUser,
        userDescription,
        userCountry,
        avatarId,
        connection,
      });
      if (foundUser.avatar) {
        await deleteS3Object({
          fileLink: foundUser.avatar.source,
          folderName: "userMedia/",
        });
        await removeUserAvatar({
          userId: foundUser.id,
          avatarId: foundUser.avatar.id,
          connection,
        });
      }
    }
    return formatResponse(responses.userDetailsUpdated);
  }
  throw createError(...formatError(errors.userNotFound));
};

export const getUserSettings = async ({ userId, connection }) => {
  // $TODO Minimize overhead
  const foundUser = await fetchUserById({
    userId,
    selection: [
      ...USER_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["LICENSE_INFO"](),
      ...USER_SELECTION["DETAILED_INFO"](),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"](),
    ],
    connection,
  });
  if (!isObjectEmpty(foundUser)) {
    // $TODO change name
    return { user: foundUser };
  }
  throw createError(...formatError(errors.userNotFound));
};

export const createUserIntent = async ({
  userId,
  versionId,
  intentId,
  connection,
}) => {
  await addNewIntent({
    userId,
    versionId,
    intentId,
    connection,
  });
  return formatResponse(responses.userIntentCreated);
};

export const deleteUserIntent = async ({ userId, intentId, connection }) => {
  await removeExistingIntent({
    userId,
    intentId,
    connection,
  });
  return formatResponse(responses.userIntentDeleted);
};

// $TODO Update user context with new data
export const updateUserEmail = async ({
  userId,
  userEmail,
  response,
  connection,
}) => {
  await emailValidation.validate({ userEmail });
  const foundEmail = await fetchUserIdByEmail({ userEmail, connection });
  if (!foundEmail) {
    const {
      verificationToken,
      verificationLink,
      verificationExpiry,
      verified,
    } = generateVerificationToken();
    await editUserEmail({
      userId,
      userEmail,
      verificationToken,
      verificationExpiry,
      verified,
      connection,
    });
    const emailValues = formatEmailContent({
      replacementValues: {
        heading: "Verify new email",
        text: "You are receiving this because you have changed your email address. Please click on the button below to continue. If you don't recognize this action, please ignore this email.",
        button: "Confirm email",
        redirect: verificationLink,
      },
      replacementAttachments: [],
    });
    await sendEmail({
      emailReceiver: userEmail,
      emailSubject: "Confirm your email",
      emailContent: renderEmail({ ...emailValues.formattedProps }),
      emailAttachments: emailValues.formattedAttachments,
    });
    logUserOut({ response });
    return formatResponse(responses.emailAddressUpdated);
  }
  throw createError(...formatError(errors.emailAlreadyExists));
};

// needs transaction (done)
export const updateUserPassword = async ({
  userId,
  userCurrent,
  userPassword,
  userConfirm,
  connection,
}) => {
  await passwordValidation.validate({
    userCurrent,
    userPassword,
    userConfirm,
  });
  const foundUser = await fetchUserByAuth({ userId, connection });
  if (!isObjectEmpty(foundUser)) {
    if (!foundUser.verified) {
      throw createError(...formatError(errors.userNotVerified));
    }
    const isCurrentValid = await verifyHash(foundUser.password, userCurrent);
    if (!isCurrentValid)
      throw createError(...formatError(errors.currentPasswordIncorrect));
    const isPasswordValid = await verifyHash(foundUser.password, userPassword);
    if (isPasswordValid)
      throw createError(...formatError(errors.newPasswordIdentical));
    const hashedPassword = await hashString(userPassword);
    await editUserPassword({ userId, hashedPassword, connection });
    return formatResponse(responses.passwordUpdated);
  }
  throw createError(...formatError(errors.userNotFound));
};

// needs transaction (done)
// $TODO Update context with new data
export const updateUserPreferences = async ({
  userId,
  userFavorites,
  connection,
}) => {
  await preferencesValidation.validate({ userFavorites });
  const updatedUser = await editUserPreferences({
    userId,
    userFavorites,
    connection,
  });
  if (updatedUser.affected !== 0) {
    return formatResponse(responses.preferencesUpdated);
  }
  throw createError(...formatError(errors.userNotFound));
};

export const deactivateUser = async ({ userId, response, connection }) => {
  const foundUser = await fetchUserById({
    userId,
    selection: [
      ...AVATAR_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPE_INFO"](),
    ],
    connection,
  });
  debugger;
  let shouldDeleteStripe = false;
  if (!isObjectEmpty(foundUser)) {
    // FEATURE FLAG - stripe
    if (featureFlags.stripe) {
      if (foundUser.stripeId) {
        const userBalance = await fetchStripeBalance({
          stripeId: foundUser.stripeId,
        });
        if (
          STRIPE_BALANCE_TYPES.some((type) =>
            userBalance[type]?.some((item) => item.amount > 0)
          )
        ) {
          throw createError(...formatError(errors.stripeBalanceUncleared));
        } else {
          shouldDeleteStripe = true;
        }
      }
    }
    const foundArtwork = await fetchUserMedia({
      userId,
      connection,
    });
    for (let artwork of foundArtwork) {
      const foundOrders = await fetchOrdersByArtwork({
        userId: foundUser.id,
        artworkId: artwork.id,
        connection,
      });
      if (isArrayEmpty(foundOrders)) {
        const oldVersion = artwork.current;
        await deactivateArtworkVersion({ artworkId: artwork.id, connection });
        await deleteS3Object({
          fileLink: oldVersion.cover.source,
          folderName: "artworkCovers/",
        });
        await deleteS3Object({
          fileLink: oldVersion.media.source,
          folderName: "artworkMedia/",
        });
        await removeArtworkVersion({
          versionId: oldVersion.id,
          connection,
        });
      } else if (
        foundOrders.some((item) => item.versionId === artwork.current.id)
      ) {
        await deactivateExistingArtwork({ artworkId: artwork.id, connection });
      } else {
        const oldVersion = artwork.current;
        await deactivateArtworkVersion({ artworkId: artwork.id, connection });
        await removeArtworkVersion({
          versionId: oldVersion.id,
          connection,
        });
      }
    }
    if (foundUser.avatar) {
      await deleteS3Object({
        fileLink: foundUser.avatar.source,
        folderName: "userMedia/",
      });
    }
    await deleteUserNotifications({ userId: foundUser.id, connection });
    await deactivateExistingUser({ userId: foundUser.id, connection });
    if (shouldDeleteStripe) {
      await deleteStripeAccount({ stripeId: foundUser.stripeId });
    }
    logUserOut({ response });
    return formatResponse(responses.userDeactivated);
  }
  throw createError(...formatError(errors.userNotFound));
};
