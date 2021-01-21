import argon2 from "argon2";
import aws from "aws-sdk";
import createError from "http-errors";
import { isObjectEmpty } from "../common/helpers";
import {
  emailValidation,
  originValidation,
  passwordValidation,
  preferencesValidation,
  profileValidation,
} from "../common/validation";
import {
  fetchOrdersByBuyer,
  fetchOrdersBySeller,
} from "../services/postgres/order.js";
import { fetchStripeBalance } from "../services/postgres/stripe.js";
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
  fetchUserFavorites,
  fetchUserIdByEmail,
  fetchUserIdByUsername,
  fetchUserNotifications,
  fetchUserProfile,
  fetchUserPurchases,
  fetchUserReviews,
  fetchUserSales,
  removeExistingIntent,
} from "../services/postgres/user.js";
import { sendEmail } from "../utils/email.js";
import {
  generateToken,
  generateUuids,
  sanitizeData,
} from "../utils/helpers.js";
import { deleteS3Object, finalizeMediaUpload } from "../utils/upload.js";

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ID,
  region: process.env.S3_REGION,
});

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
  throw createError(400, "User not found");
};

export const getUserArtwork = async ({ userId, cursor, limit, connection }) => {
  const foundArtwork = await fetchUserArtwork({
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
  userId,
  cursor,
  limit,
  connection,
}) => {
  const foundFavorites = await fetchUserFavorites({
    userId,
    cursor,
    limit,
    connection,
  });
  return { favorites: foundFavorites };
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
  await originValidation.validate(sanitizeData({ userBusinessAddress }));
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    await editUserOrigin({
      userId: foundUser.id,
      userBusinessAddress,
      connection,
    });
    return { message: "User business address updated" };
  }
  throw createError(400, "User not found");
};

export const updateUserProfile = async ({
  userId,
  userPath,
  userFilename,
  userMimetype,
  userData,
  connection,
}) => {
  // $TODO Validate data passed to upload
  const avatarUpload = await finalizeMediaUpload({
    filePath: userPath,
    fileName: userFilename,
    mimeType: userMimetype,
    fileType: "user",
  });
  await profileValidation.validate(sanitizeData(userData));
  // $TODO Find or fail? Minimize overhead
  const foundUser = await fetchUserById({ userId, connection });
  let avatarId;
  if (avatarUpload.fileMedia) {
    if (foundUser.avatar) {
      await editUserAvatar({ userId: foundUser.id, avatarUpload, connection });
    } else {
      const { avatarId } = generateUuids({
        avatarId: null,
      });
      await addUserAvatar({
        avatarId,
        userId: foundUser.id,
        avatarUpload,
        connection,
      });
    }
  }
  await editUserProfile({
    foundUser,
    userData,
    avatarId,
    connection,
  });
  return { message: "User details updated" };
};

export const getUserSettings = async ({ userId, connection }) => {
  // $TODO Minimize overhead
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    // $TODO change name
    return { user: foundUser };
  }
  throw createError(400, "User not found");
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
  return { message: "Intent successfully saved" };
};

export const deleteUserIntent = async ({ userId, intentId, connection }) => {
  await removeExistingIntent({
    userId,
    intentId,
    connection,
  });
  return { message: "Intent successfully deleted" };
};

// $TODO Update user context with new data
export const updateUserEmail = async ({ userId, userEmail, connection }) => {
  await emailValidation.validate(sanitizeData({ userEmail }));
  const emailUsed = await fetchUserIdByEmail({ userEmail, connection });
  if (emailUsed) {
    throw createError(400, "User with provided email already exists");
  } else {
    const { verificationToken, verificationLink } = generateToken();
    await editUserEmail({ userId, userEmail, verificationToken, connection });
    await sendEmail({
      emailReceiver: userEmail,
      emailSubject: "Please confirm your email",
      emailContent: `Hello,
        Please click on the link to verify your email:

        <a href=${verificationLink}>Click here to verify</a>`,
    });
    return { message: "Email successfully updated" };
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
      throw createError(400, "Current password is incorrect");
    const isPasswordValid = await argon2.verify(
      foundUser.password,
      userPassword
    );
    if (isPasswordValid)
      throw createError(400, "New password cannot be identical to the old one");
    await passwordValidation.validate(
      sanitizeData({
        userCurrent,
        userPassword,
        userConfirm,
      })
    );
    const hashedPassword = await argon2.hash(userPassword);
    await editUserPassword({ userId, hashedPassword, connection });
    return { message: "Password updated successfully" };
  }
  throw createError(400, "User not found");
};

// needs transaction (done)
// $TODO Update context with new data
export const updateUserPreferences = async ({
  userId,
  userFavorites,
  connection,
}) => {
  await preferencesValidation.validate(sanitizeData({ userFavorites }));
  await editUserPreferences({ userId, userFavorites, connection });
  return { message: "Preferences updated successfully" };
};

/* const deleteUser = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $and: [{ id: res.locals.user.id }, { active: true }]
    });
    if (foundUser) {
      if (foundUser.avatar.includes(foundUser.id)) {
        const folderName = 'profileavatars/';
        const fileName = foundUser.avatar.split('/').slice(-1)[0];
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: filePath
        };
        await s3.deleteObject(params).promise();
      }
      const updatedUser = await User.updateOne(
        { id: foundUser.id },
        {
          $set: {
            name: 'Deleted User',
            password: null,
            avatar: foundUser.gravatar(),
            description: null,
            facebookId: null,
            googleId: null,
            customWork: false,
            verificationToken: null,
            verified: false,
            resetToken: null,
            resetExpiry: null,
            discount: null,
            inbox: null,
            notifications: null,
            rating: null,
            reviews: null,
            favorites: null,
            earnings: null,
            incomingFunds: null,
            outgoingFunds: null,
            escrow: null,
            active: false
          }
        }
      );
      if (updatedUser) {
        req.logout();
        req.connection.destroy(function(err) {
          res.json('/');
        });
      } else {
        return res.status(400).json({ message: 'User could not be deleted' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
}; */

// needs testing (better way to update already found user)
// not tested
// needs transaction (not tested)
export const deactivateUser = async ({ userId, connection }) => {
  const foundUser = await fetchUserById({ userId, connection });
  if (foundUser) {
    const foundArtwork = await fetchUserArtwork({
      userId,
      connection,
    });
    for (let artwork of foundArtwork) {
      const foundOrder = await fetchOrderByVersion({
        artworkId: artwork.id,
        versionId: artwork.current.id,
        connection,
      });
      if (!foundOrder.length) {
        await deleteS3Object({
          fileLink: artwork.current.cover,
          folderName: "artworkCovers/",
        });

        await deleteS3Object({
          fileLink: artwork.current.media,
          folderName: "artworkMedia/",
        });

        await removeArtworkVersion({
          versionId: artwork.current.id,
          connection,
        });
      }
      await deactivateExistingArtwork({ artworkId: artwork.id, connection });
    }
    await deleteS3Object({
      fileLink: foundUser.avatar,
      folderName: "profilePhotos/",
    });
    await deactivateExistingUser({ userId: foundUser.id, connection });
    req.logout();
    req.connection.destroy(function (err) {
      res.json("/");
    });
    return { message: "User deactivated" };
  }
  throw createError(400, "User not found");
};

export const getUserMedia = async ({ userId, artworkId, connection }) => {
  const foundMedia = await fetchSellerMedia({
    userId,
    artworkId,
    connection,
  });
  if (foundMedia) {
    const s3 = new aws.S3({ signatureVersion: "v4" });
    const file = foundMedia.source.split("/").pop();
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
