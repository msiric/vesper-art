import argon2 from "argon2";
import { Artwork } from "../../entities/Artwork";
import { Notification } from "../../entities/Notification";
import { User } from "../../entities/User";

// $Needs testing (mongo -> postgres)
export const fetchUserById = async ({ userId }) => {
  return await User.findOne({
    where: [{ id: userId }, { active: true }],
  });
};

// $Needs testing (mongo -> postgres)
export const fetchUserByEmail = async ({ userEmail }) => {
  return await User.findOne({
    where: [{ email: userEmail }, { active: true }],
  });
};

// $CHECKED NOT USED (Can be left as is)
export const fetchUserByToken = async ({ tokenId }) => {
  return await User.findOne({
    where: [{ resetToken: tokenId, resetExpiry: { $gt: Date.now() } }],
  });
};

// $Done (mongo -> postgres)
export const fetchUserByCreds = async ({ userUsername }) => {
  return await User.findOne({
    where: [
      { email: userUsername, active: true },
      { name: userUsername, active: true },
    ],
  });
};

// $Needs testing (mongo -> postgres)
// $TODO doesn't limit purchases, but user?
export const fetchUserPurchases = async ({ userId, dataSkip, dataLimit }) => {
  return dataSkip && dataLimit
    ? await User.findOne({
        where: [{ id: userId, active: true }],
        relations: [
          "purchases",
          "purchases.seller",
          "purchases.version",
          "purchases.review",
        ],
        skip: dataSkip,
        take: dataLimit,
      })
    : await User.findOne({
        where: [{ id: userId, active: true }],
        relations: [
          "purchases",
          "purchases.seller",
          "purchases.version",
          "purchases.review",
        ],
      });
};

// $Needs testing (mongo -> postgres)
// $TODO doesn't limit sales, but user?
export const fetchUserSales = async ({ userId, dataSkip, dataLimit }) => {
  return dataSkip && dataLimit
    ? await User.findOne({
        where: [{ id: userId, active: true }],
        relations: ["sales", "sales.buyer", "sales.version", "sales.review"],
        skip: dataSkip,
        take: dataLimit,
      })
    : await User.findOne({
        where: [{ id: userId, active: true }],
        relations: ["sales", "sales.buyer", "sales.version", "sales.review"],
      });
};

// $Needs testing (mongo -> postgres)
export const editUserStripe = async ({ userId, stripeId }) => {
  const foundUser = await User.findOne({ where: [{ id: userId }] });
  foundUser.stripeId = stripeId;
  return await User.save({ foundUser });
};

// $Needs testing (mongo -> postgres)
export const editUserPurchase = async ({ userId, orderId }) => {
  const foundUser = await User.findOne({ where: [{ id: userId }] });
  foundUser.purchases.push(orderId);
  return await User.save({ foundUser });
};

// $Needs testing (mongo -> postgres)
export const editUserSale = async ({ userId, orderId }) => {
  const foundUser = await User.findOne({ where: [{ id: userId }] });
  foundUser.sales.push(orderId);
  foundUser.notifications++;
  return await User.save({ foundUser });
};

// $Needs testing (mongo -> postgres)
// $TODO doesn't limit artwork, but user?
export const fetchUserProfile = async ({
  userUsername,
  dataSkip,
  dataLimit,
}) => {
  const foundUser =
    dataSkip && dataLimit
      ? await User.findOne({
          where: [{ name: userUsername, active: true }],
          relations: ["artwork", "artwork.owner", "artwork.current"],
          skip: dataSkip,
          take: dataLimit,
        })
      : await User.findOne({
          where: [{ name: userUsername, active: true }],
          relations: ["artwork", "artwork.owner", "artwork.current"],
        });
  return foundUser.artwork.filter((artwork) => artwork.active === true);
};

// $Needs testing (mongo -> postgres)
export const fetchUserArtwork = async ({ userId, dataCursor, dataCeiling }) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  return await Artwork.find({
    where: [{ owner: userId, active: true }],
    skip: dataSkip,
    take: dataLimit,
  });
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
