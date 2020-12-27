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
// $TODO how to filter only active artwork?
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

// $Needs testing (mongo -> postgres)
// $TODO doesn't limit favorites, but user?
export const fetchuserFavorites = async ({ userId, dataSkip, dataLimit }) => {
  return await User.findOne({
    where: [{ id: userId, active: true }],
    relations: ["favorites", "current"],
    skip: dataSkip,
    take: dataLimit,
  });
};

// $Needs testing (mongo -> postgres)
export const fetchUserStatistics = async ({ userId }) => {
  return await User.findOne({
    where: [{ id: userId, active: true }],
    relations: [
      "purchases",
      "sales",
      "purchases.version",
      "purchases.license",
      "sales.version",
      "sales.license",
    ],
  });
};

// $TODO avatar needs to be saved properly
export const editUserProfile = async ({
  foundUser,
  avatarUpload,
  userData,
}) => {
  if (foundUser) {
    if (avatarUpload.fileMedia) foundUser.avatar = avatarUpload.fileMedia;
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
    return await foundUser.save();
  }
  throw createError(400, "User not found");
};

// $Needs testing (mongo -> postgres)
export const fetchUserNotifications = async ({
  userId,
  dataSkip,
  dataLimit,
}) => {
  return await Notification.find({
    where: [{ receiver: userId }],
    skip: dataSkip,
    take: dataLimit,
    relations: ["user"],
    order: {
      created: "DESC",
    },
  });
};

// $Needs testing (mongo -> postgres)
export const editUserEmail = async ({
  userId,
  userEmail,
  verificationToken,
}) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.email = userEmail;
  foundUser.verificationToken = verificationToken;
  foundUser.verified = false;
  return await User.save({ foundUser });
};

// $Needs testing (mongo -> postgres)
export const editUserPassword = async ({ userId, userPassword }) => {
  const hashedPassword = await argon2.hash(userPassword);
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.password = hashedPassword;
  return await User.save({ foundUser });
};

// $Needs testing (mongo -> postgres)
export const editUserPreferences = async ({ userId, userFavorites }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.displayFavorites = userFavorites;
  return await User.save({ foundUser });
};

// $Needs testing (mongo -> postgres)
export const addUserArtwork = async ({ userId, savedArtwork }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.artwork.push(savedArtwork);
  return await User.save({ foundUser });
};

// $Needs testing (mongo -> postgres)
export const addUserLicense = async ({ savedLicense }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.licenses.push(savedLicense);
  return await User.save({ foundUser });
};

// $Needs testing (mongo -> postgres)
export const addUserFavorite = async ({ userId, savedFavorite }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.favorites.push(savedFavorite);
  return await User.save({ foundUser });
};

// $TODO probably not how it's done
export const removeUserFavorite = async ({ userId, artworkId }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.favorites.filter((favorite) => favorite !== artworkId);
  return await User.save({ foundUser });
};

// $TODO doesn't work this way anymore
export const addUserNotification = async ({ userId }) => {
  return await User.updateOne(
    { id: userId },
    { $inc: { notifications: 1 } }
  ).session(session);
};

// $Needs testing (mongo -> postgres)
export const addNewIntent = async ({ userId, versionId, intentId }) => {
  const foundUser = await User.findOne({ where: [{ id: userId }] });
  foundUser.intents.push(intentId);
  return await User.save({ foundUser });
};

// $TODO probably not how it's done
export const removeExistingIntent = async ({
  userId,
  intentId,
  session = null,
}) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.intents.filter((intent) => intent !== intentId);
  return await User.save({ foundUser });
};

// $TODO probably not how it's done
export const editUserRating = async ({ userId, userRating }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.rating = userRating;
  foundUser.reviews++;
};

// needs testing (better way to update already found user)
// not tested
// needs transaction (not tested)
// $Needs testing (mongo -> postgres)
export const deactivateExistingUser = async ({ userId }) => {
  const foundUser = await User.findOne({ where: [{ id: userId }] });
  foundUser.email = "";
  foundUser.name = "";
  foundUser.password = "";
  foundUser.avatar = null;
  foundUser.description = "";
  foundUser.country = "";
  foundUser.businessAddress = "";
  foundUser.resetToken = "";
  foundUser.resetExpiry = null;
  foundUser.verificationToken = "";
  foundUser.active = false;
  return await User.save({ foundUser });
};
