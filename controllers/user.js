import argon2 from "argon2";
import createError from "http-errors";
import { isObjectEmpty } from "../common/helpers";
import {
  emailValidation,
  originValidation,
  passwordValidation,
  preferencesValidation,
  profileValidation,
} from "../common/validation";
import { deleteS3Object, getSignedS3Object } from "../lib/s3";
import {
  deactivateArtworkVersion,
  deactivateExistingArtwork,
  removeArtworkVersion,
} from "../services/postgres/artwork";
import { logUserOut } from "../services/postgres/auth";
import {
  fetchOrdersByArtwork,
  fetchOrdersByBuyer,
  fetchOrdersBySeller,
} from "../services/postgres/order";
import { fetchStripeBalance } from "../services/postgres/stripe";
import {
  addNewIntent,
  addUserAvatar,
  deactivateExistingUser,
  editUserAvatar,
  editUserEmail,
  editUserOrigin,
  editUserPassword,
  editUserPreferences,
  editUserProfile,
  fetchSellerMedia,
  fetchUserArtwork,
  fetchUserByAuth,
  fetchUserById,
  fetchUserByUsername,
  fetchUserFavorites,
  fetchUserIdByEmail,
  fetchUserIdByUsername,
  fetchUserMedia,
  fetchUserNotifications,
  fetchUserProfile,
  fetchUserPurchases,
  fetchUserReviews,
  fetchUserSales,
  fetchUserUploads,
  removeExistingIntent,
  removeUserAvatar,
} from "../services/postgres/user";
import { sendEmail } from "../utils/email";
import {
  formatError,
  formatResponse,
  generateUuids,
  generateVerificationToken,
} from "../utils/helpers";
import { errors, responses } from "../utils/statuses";
import { finalizeMediaUpload } from "../utils/upload";
import { deleteUserNotifications } from "./notification";

export const getUserProfile = async ({
  userUsername,
  cursor,
  limit,
  connection,
}) => {
  const foundId = await fetchUserIdByUsername({
    userUsername,
    connection,
  });
  const foundUser = await fetchUserProfile({
    userUsername,
    userId: foundId,
    cursor,
    limit,
    connection,
  });
  if (foundUser) return { user: foundUser };
  throw createError(...formatError(errors.userNotFound));
};

export const getUserArtwork = async ({
  userUsername,
  cursor,
  limit,
  connection,
}) => {
  const foundId = await fetchUserIdByUsername({
    userUsername,
    connection,
  });
  const foundArtwork = await fetchUserArtwork({
    userId: foundId,
    cursor,
    limit,
    connection,
  });
  return { artwork: foundArtwork };
};

export const getUserUploads = async ({ userId, cursor, limit, connection }) => {
  const foundArtwork = await fetchUserUploads({
    userId,
    cursor,
    limit,
    connection,
  });
  return { artwork: foundArtwork };
};

export const getUserOwnership = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  const foundPurchases = await fetchUserPurchases({
    userId,
    cursor,
    limit,
    connection,
  });
  // $TODO change name
  return { purchases: foundPurchases };
};

export const getUserFavorites = async ({
  userUsername,
  cursor,
  limit,
  connection,
}) => {
  const foundUser = await fetchUserByUsername({
    userUsername,
    connection,
  });
  if (foundUser.displayFavorites) {
    const foundFavorites = await fetchUserFavorites({
      userId: foundUser.id,
      cursor,
      limit,
      connection,
    });
    return { favorites: foundFavorites };
  }
  throw createError(...formatError(errors.userFavoritesNotAllowed));
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
  console.log("aaa", foundUser, foundFavorites, foundPurchases);
  return {
    purchases: foundPurchases,
    favorites: foundFavorites,
  };
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
  const balance = await fetchStripeBalance({
    stripeId: foundUser.stripeId,
    connection,
  });
  console.log("aaa", foundUser, foundReviews, foundSales);
  const { amount } = balance.available[0];
  return { sales: foundSales, amount, reviews: foundReviews };
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

export const updateUserOrigin = async ({
  userId,
  userBusinessAddress,
  connection,
}) => {
  await originValidation.validate({ userBusinessAddress });
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    await editUserOrigin({
      userId: foundUser.id,
      userBusinessAddress,
      connection,
    });
    return formatResponse(responses.businessAddressUpdated);
  }
  throw createError(...formatError(errors.userNotFound));
};

export const updateUserProfile = async ({
  userId,
  userPath,
  userFilename,
  userMimetype,
  userData,
  connection,
}) => {
  // $TODO delete S3 images when not being used anymore
  // $TODO Validate data passed to upload
  const avatarUpload = await finalizeMediaUpload({
    filePath: userPath,
    fileName: userFilename,
    mimeType: userMimetype,
    fileType: "user",
  });
  await profileValidation.validate(userData);
  const foundUser = await fetchUserById({ userId, connection });
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
      userData,
      avatarId,
      connection,
    });
  } else {
    if (!foundUser.avatar) {
      avatarId = null;
    }
    await editUserProfile({
      foundUser,
      userData,
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
};

export const getUserSettings = async ({ userId, connection }) => {
  // $TODO Minimize overhead
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    // $TODO change name
    return { user: foundUser };
  }
  throw createError(...formatError(errors.userNotFound));
};

export const getUserNotifications = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  const foundNotifications = await fetchUserNotifications({
    userId,
    cursor,
    limit,
    connection,
  });
  return { notifications: foundNotifications };
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
export const updateUserEmail = async ({ userId, userEmail, connection }) => {
  await emailValidation.validate({ userEmail });
  const emailUsed = await fetchUserIdByEmail({ userEmail, connection });
  if (emailUsed) {
    throw createError(...formatError(errors.emailAlreadyExists));
  } else {
    const { verificationToken, verificationLink, verificationExpiry } =
      generateVerificationToken();
    await editUserEmail({
      userId,
      userEmail,
      verificationToken,
      verificationExpiry,
      connection,
    });
    await sendEmail({
      emailReceiver: userEmail,
      emailSubject: "Please confirm your email",
      emailContent: `Hello,
        Please click on the link to verify your email:

        <a href=${verificationLink}>Click here to verify</a>`,
    });
    return formatResponse(responses.emailAddressUpdated);
  }
};

// needs transaction (done)
export const updateUserPassword = async ({
  userId,
  userCurrent,
  userPassword,
  userConfirm,
  connection,
}) => {
  const foundUser = await fetchUserByAuth({ userId, connection });
  if (!isObjectEmpty(foundUser)) {
    const isCurrentValid = await argon2.verify(foundUser.password, userCurrent);
    if (!isCurrentValid)
      throw createError(...formatError(errors.currentPasswordIncorrect));
    const isPasswordValid = await argon2.verify(
      foundUser.password,
      userPassword
    );
    if (isPasswordValid)
      throw createError(...formatError(errors.newPasswordIdentical));
    await passwordValidation.validate({
      userCurrent,
      userPassword,
      userConfirm,
    });
    const hashedPassword = await argon2.hash(userPassword);
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
  await editUserPreferences({ userId, userFavorites, connection });
  return formatResponse(responses.preferencesUpdated);
};

export const deactivateUser = async ({ userId, response, connection }) => {
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
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
      if (!foundOrders.length) {
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
    logUserOut(response);
    return formatResponse(responses.userDeactivated);
  }
  throw createError(...formatError(errors.userNotFound));
};

export const getUserMedia = async ({ userId, artworkId, connection }) => {
  const foundMedia = await fetchSellerMedia({
    userId,
    artworkId,
    connection,
  });
  if (foundMedia) {
    const { url, file } = await getSignedS3Object({
      fileLink: foundMedia.source,
      folderName: "artworkMedia/",
    });
    return { url, file };
  }
  throw createError(...formatError(errors.artworkNotFound));
};
