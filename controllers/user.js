import mongoose from "mongoose";
import randomString from "randomstring";
import { sendEmail } from "../utils/email.js";
import { server } from "../config/secret.js";
import { formatParams, sanitizeData } from "../utils/helpers.js";
import {
  fetchUserArtworks,
  fetchArtworksByOwner,
} from "../services/artwork.js";
import { fetchOrdersBySeller, fetchOrdersByBuyer } from "../services/order.js";
import {
  fetchUserById,
  fetchUserByEmail,
  fetchUserProfile,
  fetchUserSaves,
  fetchUserStatistics,
  fetchUserNotifications,
  editUserEmail,
  editUserPassword,
  editUserPreferences,
  deactivateExistingUser,
} from "../services/user.js";
import createError from "http-errors";
import { fetchStripeBalance } from "../services/stripe.js";
import profileValidator from "../utils/validation/profile.js";
import emailValidator from "../utils/validation/email.js";
import passwordValidator from "../utils/validation/password.js";
import preferencesValidator from "../utils/validation/preferences.js";
import rangeValidator from "../utils/validation/range.js";

const getUserProfile = async ({ username, cursor, ceiling }) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
  const foundUser = await fetchUserProfile({ username, skip, limit });
  if (foundUser) {
    return { user: foundUser, artwork: foundUser.artwork };
  }
  throw createError(400, "User not found");
};

const getUserArtwork = async ({ userId, cursor, ceiling }) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
  const foundArtwork = fetchUserArtworks({
    userId,
    skip,
    limit,
  });
  return { artwork: foundArtwork };
};

const getUserSaves = async ({ userId, cursor, ceiling }) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
  const foundUser = await fetchUserSaves({ userId, skip, limit });
  return { saves: foundUser.savedArtwork };
};

const getUserStatistics = async ({ userId }) => {
  // brisanje accounta
  /*     stripe.accounts.del('acct_1Gi3zvL1KEMAcOES', function (err, confirmation) {
    }); */
  const foundUser = await fetchUserStatistics({ userId });
  const balance = await fetchStripeBalance({ stripeId: foundUser.stripeId });
  const { amount, currency } = balance.available[0];
  return { statistics: foundUser, amount: amount };
};

const getUserSales = async ({ userId, from, to }) => {
  const { error } = rangeValidator(
    sanitizeData({ rangeFrom: from, rangeTo: to })
  );
  if (error) throw createError(400, error);
  const foundOrders = await fetchOrdersBySeller({ userId, from, to });
  return { statistics: foundOrders };
};

const getUserPurchases = async ({ userId, from, to }) => {
  const { error } = rangeValidator(
    sanitizeData({ rangeFrom: from, rangeTo: to })
  );
  if (error) throw createError(400, error);
  const foundOrders = await fetchOrdersByBuyer({ userId, from, to });
  return { statistics: foundOrders };
};

const updateUserProfile = async ({
  userId,
  userMedia,
  userDescription,
  userCountry,
  userDimensions,
  session,
}) => {
  const { error } = profileValidator(
    sanitizeData({ userMedia, userDescription, userCountry })
  );
  if (error) throw createError(400, error);
  const foundUser = await fetchUserById({ userId, session });
  if (foundUser) {
    if (userMedia) foundUser.photo = userMedia;
    if (userDescription) foundUser.description = userDescription;
    if (userCountry) foundUser.country = userCountry;
    if (userDimensions.height && userDimensions.width) {
      foundUser.height = userDimensions.height;
      foundUser.width = userDimensions.width;
    }
    await foundUser.save({ session });
    return { message: "User details updated" };
  }
  throw createError(400, "User not found");
};

const getUserSettings = async ({ userId }) => {
  const foundUser = await fetchUserById({ userId });
  if (foundUser) {
    return { user: foundUser };
  }
  throw createError(400, "User not found");
};

const getUserNotifications = async ({ userId, cursor, ceiling }) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
  const foundNotifications = await fetchUserNotifications({
    userId,
    skip,
    limit,
  });
  return { notifications: foundNotifications };
};

const updateUserEmail = async ({ userId, email, session }) => {
  const { error } = emailValidator(sanitizeData({ userEmail: email }));
  if (error) throw createError(400, error);
  const foundUser = await fetchUserByEmail({ email, session });
  if (foundUser) {
    throw createError(400, "User with entered email already exists");
  } else {
    const token = randomString.generate();
    const link = `${server.clientDomain}/verify_token/${token}`;
    await editUserEmail({ userId, email, token, session });
    await sendEmail(
      server.appName,
      email,
      "Please confirm your email",
      `Hello,
        Please click on the link to verify your email:

        <a href=${link}>Click here to verify</a>`
    );
    return { message: "Email successfully updated" };
  }
};

// needs transaction (done)
const updateUserPassword = async ({ userId, current, password, confirm }) => {
  const { error } = passwordValidator(
    sanitizeData({
      currentPassword: current,
      newPassword: password,
      confirmedPassword: confirm,
    })
  );
  if (error) throw createError(400, error);
  await editUserPassword({ userId, password });
  return { message: "Password updated successfully" };
};

// needs transaction (done)
const updateUserPreferences = async ({ userId, displaySaves }) => {
  const { error } = preferencesValidator(sanitizeData({ displaySaves }));
  if (error) throw createError(400, error);
  await editUserPreferences({ userId, displaySaves });
  return { message: "Preferences updated successfully" };
};

/* const deleteUser = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }]
    });
    if (foundUser) {
      if (foundUser.photo.includes(foundUser._id)) {
        const folderName = 'profilePhotos/';
        const fileName = foundUser.photo.split('/').slice(-1)[0];
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: filePath
        };
        await s3.deleteObject(params).promise();
      }
      const updatedUser = await User.updateOne(
        { _id: foundUser._id },
        {
          $set: {
            name: 'Deleted User',
            password: null,
            photo: foundUser.gravatar(),
            description: null,
            facebookId: null,
            googleId: null,
            customWork: false,
            verificationToken: null,
            verified: false,
            resetToken: null,
            resetExpiry: null,
            cart: null,
            discount: null,
            inbox: null,
            notifications: null,
            rating: null,
            reviews: null,
            savedArtwork: null,
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
const deactivateUser = async ({ userId, session }) => {
  const foundUser = await fetchUserById({ userId, session });
  if (foundUser) {
    const foundArtwork = await fetchArtworksByOwner({
      userId,
      session,
    });
    for (let artwork of foundArtwork) {
      const foundOrder = await fetchOrderByVersion({
        artworkId: artwork._id,
        versionId: artwork.current._id,
        session,
      });
      if (!foundOrder.length) {
        await deleteS3Object({
          link: artwork.current.cover,
          folder: "artworkCovers/",
        });

        await deleteS3Object({
          link: artwork.current.media,
          folder: "artworkMedia/",
        });

        await removeArtworkVersion({
          versionId: artwork.current._id,
          session,
        });
      }
      await deactivateExistingArtwork({ artworkId: artwork._id, session });
    }
    await deleteS3Object({
      link: foundUser.photo,
      folder: "profilePhotos/",
    });
    await deactivateExistingUser({ userId: foundUser._id, session });
    req.logout();
    req.session.destroy(function (err) {
      res.json("/");
    });
    return { message: "User deactivated" };
  }
  throw createError(400, "User not found");
};

export default {
  getUserProfile,
  getUserArtwork,
  getUserSaves,
  getUserStatistics,
  getUserSales,
  getUserPurchases,
  updateUserProfile,
  getUserSettings,
  getUserNotifications,
  updateUserEmail,
  updateUserPassword,
  updateUserPreferences,
  deactivateUser,
};
