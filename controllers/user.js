import argon2 from "argon2";
import aws from "aws-sdk";
import createError from "http-errors";
import randomString from "randomstring";
import {
  emailValidation,
  originValidation,
  passwordValidation,
  preferencesValidation,
  profileValidation,
  rangeValidation,
} from "../common/validation";
import { server } from "../config/secret.js";
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
  fetchUserByEmail,
  fetchUserById,
  fetchUserFavorites,
  fetchUserIdByName,
  fetchUserNotifications,
  fetchUserProfile,
  fetchUserPurchases,
  fetchUserStatistics,
  removeExistingIntent,
} from "../services/postgres/user.js";
import { sendEmail } from "../utils/email.js";
import { formatParams, generateUuids, sanitizeData } from "../utils/helpers.js";
import { deleteS3Object, finalizeMediaUpload } from "../utils/upload.js";

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ID,
  region: process.env.S3_REGION,
});

export const getUserProfile = async ({
  userUsername,
  dataCursor,
  dataCeiling,
  connection,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const userId = await fetchUserIdByName({
    userUsername,
    includeEmail: false,
    connection,
  });
  const foundUser = await fetchUserProfile({
    userUsername,
    userId,
    dataSkip,
    dataLimit,
    connection,
  });
  if (foundUser) return { user: foundUser };
  throw createError(400, "User not found");
};

export const getUserArtwork = async ({
  userId,
  dataCursor,
  dataCeiling,
  connection,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchUserArtwork({
    userId,
    dataSkip,
    dataLimit,
    connection,
  });
  return { artwork: foundArtwork };
};

export const getUserOwnership = async ({
  userId,
  dataCursor,
  dataCeiling,
  connection,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundPurchases = await fetchUserPurchases({
    userId,
    dataSkip,
    dataLimit,
    connection,
  });
  return { purchases: foundPurchases };
};

export const getUserFavorites = async ({
  userId,
  dataCursor,
  dataCeiling,
  connection,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundFavorites = await fetchUserFavorites({
    userId,
    dataSkip,
    dataLimit,
    connection,
  });
  return { favorites: foundFavorites };
};

export const getUserStatistics = async ({ userId, connection }) => {
  // brisanje accounta
  /*     stripe.accounts.del('acct_1Gi3zvL1KEMAcOES', function (err, confirmation) {
    }); */
  const [foundUser, foundFavorites, foundOrders] = await Promise.all([
    fetchUserById({ userId, connection }),
    fetchUserFavorites({ userId, connection }),
    fetchUserStatistics({ userId, connection }),
  ]);
  const balance = await fetchStripeBalance({
    stripeId: foundUser.stripeId,
    connection,
  });
  const { amount } = balance.available[0];
  return { statistics: foundOrders, amount: amount, favorites: foundFavorites };
};

export const getUserSales = async ({
  userId,
  rangeFrom,
  rangeTo,
  connection,
}) => {
  await rangeValidation.validate(sanitizeData({ rangeFrom, rangeTo }));
  const foundOrders = await fetchOrdersBySeller({
    userId,
    rangeFrom,
    rangeTo,
    connection,
  });
  return { statistics: foundOrders };
};

export const getUserPurchases = async ({
  userId,
  rangeFrom,
  rangeTo,
  connection,
}) => {
  await rangeValidation.validate(sanitizeData({ rangeFrom, rangeTo }));
  const foundOrders = await fetchOrdersByBuyer({
    userId,
    rangeFrom,
    rangeTo,
    connection,
  });
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
    return { user: foundUser };
  }
  throw createError(400, "User not found");
};

export const getUserNotifications = async ({
  userId,
  dataCursor,
  dataCeiling,
  connection,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundNotifications = await fetchUserNotifications({
    userId,
    dataSkip,
    dataLimit,
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

// $TODO Update context with new data
export const updateUserEmail = async ({ userId, userEmail, connection }) => {
  await emailValidation.validate(sanitizeData({ userEmail }));
  const foundUser = await fetchUserByEmail({ userEmail, connection });
  if (foundUser) {
    throw createError(400, "User with entered email already exists");
  } else {
    const verificationToken = randomString.generate();
    const verificationLink = `${server.clientDomain}/verify_token/${verificationToken}`;
    await editUserEmail({ userId, userEmail, verificationToken, connection });
    await sendEmail(
      server.appName,
      userEmail,
      "Please confirm your email",
      `Hello,
        Please click on the link to verify your email:

        <a href=${verificationLink}>Click here to verify</a>`
    );
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
