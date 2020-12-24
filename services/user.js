import argon2 from "argon2";
import Artwork from "../models/artwork.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";

export const fetchUserById = async ({ userId, session = null }) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  });
};

export const fetchUserByEmail = async ({ userEmail, session = null }) => {
  return await User.findOne({
    $and: [{ email: userEmail }, { active: true }],
  }).session(session);
};

// $CHECKED NOT USED (Can be left as is)
export const fetchUserByToken = async ({ tokenId, session = null }) => {
  return await User.findOne({
    resetToken: tokenId,
    resetExpiry: { $gt: Date.now() },
  }).session(session);
};

export const fetchUserByCreds = async ({ userUsername, session = null }) => {
  return await User.findOne({
    $and: [
      { $or: [{ email: userUsername }, { name: userUsername }] },
      { active: true },
    ],
  }).session(session);
};

export const fetchUserPurchases = async ({
  userId,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  }).populate(
    dataSkip !== undefined && dataLimit !== undefined
      ? {
          path: "purchases",
          options: {
            limit: dataLimit,
            skip: dataSkip,
          },
          populate: {
            path: "seller version review",
          },
        }
      : {
          path: "purchases",
          populate: {
            path: "seller version review",
          },
        }
  );
};

export const fetchUserSales = async ({
  userId,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  }).populate(
    dataSkip !== undefined && dataLimit !== undefined
      ? {
          path: "sales",
          options: {
            limit: dataLimit,
            skip: dataSkip,
          },
          populate: {
            path: "buyer version review",
          },
        }
      : {
          path: "sales",
          populate: {
            path: "buyer version review",
          },
        }
  );
};

export const editUserStripe = async ({ userId, stripeId, session = null }) => {
  return await User.updateOne({ _id: userId }, { stripeId }).session(session);
};

export const editUserPurchase = async ({ userId, orderId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { purchases: orderId } }
  ).session(session);
};

export const editUserSale = async ({ userId, orderId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { sales: orderId }, $inc: { notifications: 1 } }
  ).session(session);
};

export const fetchUserProfile = async ({
  userUsername,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await User.findOne({
    $and: [{ name: userUsername }, { active: true }],
  }).populate(
    dataSkip !== undefined && dataLimit !== undefined
      ? {
          path: "artwork",
          match: { active: true },
          options: {
            limit: dataLimit,
            skip: dataSkip,
          },
          populate: {
            path: "owner current",
          },
        }
      : {
          path: "artwork",
          match: { active: true },
          populate: {
            path: "owner current",
          },
        }
  );
};

export const fetchUserArtwork = async ({
  userId,
  dataCursor,
  dataCeiling,
  session = null,
}) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  return await Artwork.find(
    {
      $and: [{ owner: userId }, { active: true }],
    },
    undefined,
    {
      skip: dataSkip,
      limit: dataLimit,
    }
  );
};

export const fetchUserSaves = async ({
  userId,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await User.findOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    undefined,
    {
      skip: dataSkip,
      limit: dataLimit,
    }
  ).populate({
    path: "savedArtwork",
    options: {
      skip: dataSkip,
      limit: dataLimit,
    },
    populate: {
      path: "current",
    },
  });
};

export const fetchUserStatistics = async ({ userId, session = null }) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  }).deepPopulate(
    "purchases.version purchases.license sales.version sales.license"
  );
};

export const editUserProfile = async ({
  foundUser,
  avatarUpload,
  userData,
  session = null,
}) => {
  if (foundUser) {
    if (avatarUpload.fileMedia) foundUser.photo = avatarUpload.fileMedia;
    if (avatarUpload.fileDominant)
      foundUser.dominant = avatarUpload.fileDominant;
    if (avatarUpload.fileOrientation)
      foundUser.orientation = avatarUpload.fileOrientation;
    if (avatarUpload.height && avatarUpload.width) {
      foundUser.height = avatarUpload.height;
      foundUser.width = avatarUpload.width;
    }
    if (userData.userDescription)
      foundUser.description = userData.userDescription;
    if (userData.userCountry) foundUser.country = userData.userCountry;
    return await foundUser.save({ session });
  }
  throw createError(400, "User not found");
};

export const fetchUserNotifications = async ({
  userId,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await Notification.find({ receiver: userId }, undefined, {
    skip: dataSkip,
    limit: dataLimit,
  })
    .populate("user")
    .sort({ created: -1 });
};

export const editUserEmail = async ({
  userId,
  userEmail,
  verificationToken,
  session = null,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { email: userEmail, verificationToken, verified: false }
  ).session(session);
};

export const editUserPassword = async ({
  userId,
  userPassword,
  session = null,
}) => {
  const hashedPassword = await argon2.hash(userPassword);
  return await User.updateOne(
    { _id: userId },
    { password: hashedPassword }
  ).session(session);
};

export const editUserPreferences = async ({
  userId,
  userSaves,
  session = null,
}) => {
  return await User.updateOne(
    { _id: userId },
    { displaySaves: userSaves }
  ).session(session);
};

export const addUserArtwork = async ({ userId, artworkId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { artwork: artworkId } }
  ).session(session);
};

export const addUserSave = async ({ userId, artworkId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { savedArtwork: artworkId } }
  ).session(session);
};

export const removeUserSave = async ({ userId, artworkId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $pull: { savedArtwork: artworkId } }
  ).session(session);
};

export const addUserNotification = async ({ userId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $inc: { notifications: 1 } }
  ).session(session);
};

export const addNewIntent = async ({
  userId,
  versionId,
  intentId,
  session = null,
}) => {
  return await User.updateOne(
    { _id: userId },
    {
      $addToSet: {
        intents: {
          intentId: intentId,
          versionId: versionId,
        },
      },
    }
  ).session(session);
};

export const removeExistingIntent = async ({
  userId,
  intentId,
  session = null,
}) => {
  return await User.updateOne(
    { _id: userId },
    {
      $pull: {
        intents: {
          intentId: intentId,
        },
      },
    }
  ).session(session);
};

export const editUserRating = async ({
  userId,
  userRating,
  session = null,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    {
      rating: userRating,
      $inc: { reviews: 1, notifications: 1 },
    }
  ).session(session);
};

// needs testing (better way to update already found user)
// not tested
// needs transaction (not tested)
export const deactivateExistingUser = async ({ userId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    {
      $set: {
        name: null,
        email: null,
        password: null,
        photo: null,
        height: null,
        width: null,
        description: null,
        facebookId: null,
        googleId: null,
        customWork: false,
        displaySaves: false,
        verificationToken: null,
        verified: false,
        resetToken: null,
        resetExpiry: null,
        inbox: null,
        notifications: null,
        rating: null,
        reviews: null,
        artwork: null,
        savedArtwork: null,
        purchases: null,
        sales: null,
        stripeId: null,
        intents: null,
        generated: false,
        active: false,
      },
    }
  ).session(session);
};
