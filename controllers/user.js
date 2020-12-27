import aws from "aws-sdk";
import createError from "http-errors";
import randomString from "randomstring";
import { server } from "../config/secret.js";
import {
  fetchArtworkByOwner,
  fetchArtworksByOwner,
} from "../services/postgres/artwork.js";
import {
  fetchOrdersByBuyer,
  fetchOrdersBySeller,
} from "../services/postgres/order.js";
import { fetchStripeBalance } from "../services/postgres/stripe.js";
import {
  addNewIntent,
  deactivateExistingUser,
  editUserEmail,
  editUserPassword,
  editUserPreferences,
  editUserProfile,
  fetchUserArtwork,
  fetchUserByEmail,
  fetchUserById,
  fetchuserFavorites,
  fetchUserNotifications,
  fetchUserProfile,
  fetchUserPurchases,
  fetchUserStatistics,
  removeExistingIntent,
} from "../services/postgres/user.js";
import { sendEmail } from "../utils/email.js";
import { formatParams, sanitizeData } from "../utils/helpers.js";
import { deleteS3Object, finalizeMediaUpload } from "../utils/upload.js";
import emailValidator from "../validation/email.js";
import originValidator from "../validation/origin.js";
import passwordValidator from "../validation/password.js";
import preferencesValidator from "../validation/preferences.js";
import profileValidator from "../validation/profile.js";
import rangeValidator from "../validation/range.js";

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ID,
  region: process.env.S3_REGION,
});

export const getUserProfile = async ({
  userUsername,
  dataCursor,
  dataCeiling,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundUser = await fetchUserProfile({
    userUsername,
    dataSkip,
    dataLimit,
  });
  if (foundUser) return { user: foundUser };
  throw createError(400, "User not found");
};

export const getUserArtwork = async ({ userId, dataCursor, dataCeiling }) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundArtwork = await fetchUserArtwork({
    userId,
    dataSkip,
    dataLimit,
  });
  return { artwork: foundArtwork };
};

export const getUserOwnership = async ({ userId, dataCursor, dataCeiling }) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundPurchases = await fetchUserPurchases({
    userId,
    dataSkip,
    dataLimit,
  });
  return { purchases: foundPurchases.purchases };
};

export const getUserFavorites = async ({ userId, dataCursor, dataCeiling }) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundUser = await fetchuserFavorites({ userId, dataSkip, dataLimit });
  return { favorites: foundUser.favorites };
};

export const getUserStatistics = async ({ userId }) => {
  // brisanje accounta
  /*     stripe.accounts.del('acct_1Gi3zvL1KEMAcOES', function (err, confirmation) {
    }); */
  const foundUser = await fetchUserStatistics({ userId });
  const balance = await fetchStripeBalance({ stripeId: foundUser.stripeId });
  const { amount } = balance.available[0];
  return { statistics: foundUser, amount: amount };
};

export const getUserSales = async ({ userId, rangeFrom, rangeTo }) => {
  const { error } = rangeValidator(sanitizeData({ rangeFrom, rangeTo }));
  if (error) throw createError(400, error);
  const foundOrders = await fetchOrdersBySeller({ userId, rangeFrom, rangeTo });
  return { statistics: foundOrders };
};

export const getUserPurchases = async ({ userId, rangeFrom, rangeTo }) => {
  const { error } = rangeValidator(sanitizeData({ rangeFrom, rangeTo }));
  if (error) throw createError(400, error);
  const foundOrders = await fetchOrdersByBuyer({ userId, rangeFrom, rangeTo });
  return { statistics: foundOrders };
};

export const updateUserOrigin = async ({
  userId,
  userBusinessAddress,
  session,
}) => {
  const { error } = originValidator(sanitizeData({ userBusinessAddress }));
  if (error) throw createError(400, error);
  const foundUser = await fetchUserById({ userId, session });
  if (foundUser) {
    if (userBusinessAddress) foundUser.businessAddress = userBusinessAddress;
    await User.save(foundUser);
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
  session,
}) => {
  // $TODO Validate data passed to upload
  const avatarUpload = await finalizeMediaUpload({
    filePath: userPath,
    fileName: userFilename,
    mimeType: userMimetype,
    fileType: "user",
  });
  const { error } = profileValidator(sanitizeData(userData));
  if (error) throw createError(400, error);
  const foundUser = await fetchUserById({ userId, session });
  await editUserProfile({ foundUser, avatarUpload, userData, session });
  return { message: "User details updated" };
};

export const getUserSettings = async ({ userId }) => {
  const foundUser = await fetchUserById({ userId });
  if (foundUser) {
    return { user: foundUser };
  }
  throw createError(400, "User not found");
};

export const getUserNotifications = async ({
  userId,
  dataCursor,
  dataCeiling,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  const foundNotifications = await fetchUserNotifications({
    userId,
    dataSkip,
    dataLimit,
  });
  return { notifications: foundNotifications };
};

export const createUserIntent = async ({ userId, versionId, intentId }) => {
  await addNewIntent({
    userId,
    versionId,
    intentId,
  });
  return { message: "Intent successfully saved" };
};

export const deleteUserIntent = async ({ userId, intentId }) => {
  await removeExistingIntent({
    userId,
    intentId,
  });
  return { message: "Intent successfully deleted" };
};

export const updateUserEmail = async ({ userId, userEmail, session }) => {
  const { error } = emailValidator(sanitizeData({ userEmail }));
  if (error) throw createError(400, error);
  const foundUser = await fetchUserByEmail({ userEmail, session });
  if (foundUser) {
    throw createError(400, "User with entered email already exists");
  } else {
    const verificationToken = randomString.generate();
    const verificationLink = `${server.clientDomain}/verify_token/${verificationToken}`;
    await editUserEmail({ userId, userEmail, verificationToken, session });
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
}) => {
  const { error } = passwordValidator(
    sanitizeData({
      userCurrent,
      userPassword,
      userConfirm,
    })
  );
  if (error) throw createError(400, error);
  await editUserPassword({ userId, userPassword });
  return { message: "Password updated successfully" };
};

// needs transaction (done)
export const updateUserPreferences = async ({ userId, userFavorites }) => {
  const { error } = preferencesValidator(sanitizeData({ userFavorites }));
  if (error) throw createError(400, error);
  await editUserPreferences({ userId, userFavorites });
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
        req.session.destroy(function(err) {
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
export const deactivateUser = async ({ userId, session }) => {
  const foundUser = await fetchUserById({ userId, session });
  if (foundUser) {
    const foundArtwork = await fetchArtworksByOwner({
      userId,
      session,
    });
    for (let artwork of foundArtwork) {
      const foundOrder = await fetchOrderByVersion({
        artworkId: artwork.id,
        versionId: artwork.current.id,
        session,
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
          session,
        });
      }
      await deactivateExistingArtwork({ artworkId: artwork.id, session });
    }
    await deleteS3Object({
      fileLink: foundUser.avatar,
      folderName: "profilePhotos/",
    });
    await deactivateExistingUser({ userId: foundUser.id, session });
    req.logout();
    req.session.destroy(function (err) {
      res.json("/");
    });
    return { message: "User deactivated" };
  }
  throw createError(400, "User not found");
};

export const getUserMedia = async ({ userId, artworkId }) => {
  const foundArtwork = await fetchArtworkByOwner({
    userId,
    artworkId,
  });
  if (foundArtwork) {
    const s3 = new aws.S3({ signatureVersion: "v4" });
    const file = foundArtwork.current.media.split("/").pop();
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
