import argon2 from "argon2";
import { Artwork } from "../../entities/Artwork";
import { Avatar } from "../../entities/Avatar";
import { Notification } from "../../entities/Notification";
import { User } from "../../entities/User";
import { formatParams } from "../../utils/helpers";

// $Needs testing (mongo -> postgres)
export const fetchUserById = async ({ userId }) => {
  return await User.findOne({
    where: [{ id: userId }, { active: true }],
    relations: ["avatar"],
  });
};

// $Needs testing (mongo -> postgres)
export const fetchUserByEmail = async ({ userEmail }) => {
  return await User.findOne({
    where: [{ email: userEmail }, { active: true }],
    relations: ["avatar"],
  });
};

// $CHECKED NOT USED (Can be left as is)
export const fetchUserByToken = async ({ tokenId }) => {
  return await User.findOne({
    where: [{ resetToken: tokenId, resetExpiry: { $gt: Date.now() } }],
    relations: ["avatar"],
  });
};

// $Done (mongo -> postgres)
export const fetchUserByCreds = async ({ userUsername }) => {
  return await User.findOne({
    where: [
      { email: userUsername, active: true },
      { name: userUsername, active: true },
    ],
    relations: ["avatar", "favorites", "intents"],
  });
};

// $Needs testing (mongo -> postgres)
export const fetchUserPurchases = async ({ userId, dataSkip, dataLimit }) => {
  return await Order.find({
    where: [{ buyerId: userId }],
    relations: ["seller", "version", "review"],
    skip: dataSkip,
    take: dataLimit,
  });
};

// $Needs testing (mongo -> postgres)
export const fetchUserSales = async ({ userId, dataSkip, dataLimit }) => {
  return await Order.find({
    where: [{ sellerId: userId }],
    relations: ["buyer", "version", "review"],
    skip: dataSkip,
    take: dataLimit,
  });
};

// $Needs testing (mongo -> postgres)
export const editUserStripe = async ({ userId, stripeId }) => {
  const foundUser = await User.findOne({ where: [{ id: userId }] });
  foundUser.stripeId = stripeId;
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const editUserPurchase = async ({ userId, orderId }) => {
  const foundUser = await User.findOne({ where: [{ id: userId }] });
  foundUser.purchases.push(orderId);
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const editUserSale = async ({ userId, orderId }) => {
  const foundUser = await User.findOne({ where: [{ id: userId }] });
  foundUser.sales.push(orderId);
  foundUser.notifications++;
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const fetchUserProfile = async ({
  userUsername,
  dataSkip,
  dataLimit,
}) => {
  const foundUser =
    dataSkip && dataLimit
      ? await User.findOne({
          where: [{ name: userUsername, active: true }],
          relations: ["avatar"],
          skip: dataSkip,
          take: dataLimit,
        })
      : await User.findOne({
          where: [{ name: userUsername, active: true }],
          relations: ["avatar"],
        });
  return foundUser;
};

// $Needs testing (mongo -> postgres)
export const fetchUserArtwork = async ({ userId, dataCursor, dataCeiling }) => {
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  return await Artwork.find({
    where: [{ owner: userId, active: true }],
    relations: ["current", "current.cover"],
    skip: dataSkip,
    take: dataLimit,
  });
};

// $Needs testing (mongo -> postgres)
export const fetchuserFavorites = async ({ userId, dataSkip, dataLimit }) => {
  return await Favorite.find({
    where: [{ ownerId: userId }],
    relations: [
      "artwork",
      "artwork.owner",
      "artwork.current",
      "artwork.current.cover",
    ],
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

// $Needs testing (mongo -> postgres)
export const addUserAvatar = async ({ avatarUpload }) => {
  const newAvatar = new Avatar();
  newAvatar.source = avatarUpload.fileMedia;
  newAvatar.dominant = avatarUpload.fileDominant;
  newAvatar.orientation = avatarUpload.fileOrientation;
  newAvatar.height = avatarUpload.fileHeight;
  newAvatar.width = avatarUpload.fileWidth;
  return newAvatar;
};

// $Needs testing (mongo -> postgres)
export const editUserAvatar = async ({ foundUser, avatarUpload }) => {
  foundUser.avatar.source = avatarUpload.fileMedia;
  foundUser.avatar.dominant = avatarUpload.fileDominant;
  foundUser.avatar.orientation = avatarUpload.fileOrientation;
  foundUser.avatar.height = avatarUpload.fileHeight;
  foundUser.avatar.width = avatarUpload.fileWidth;
  return foundUser.avatar;
};

// $Needs testing (mongo -> postgres)
export const editUserProfile = async ({ foundUser, userData, savedAvatar }) => {
  if (savedAvatar) foundUser.avatar = savedAvatar;
  if (userData.userDescription)
    foundUser.description = userData.userDescription;
  if (userData.userCountry) foundUser.country = userData.userCountry;
  return await User.save(foundUser);
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
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const editUserPassword = async ({ userId, userPassword }) => {
  const hashedPassword = await argon2.hash(userPassword);
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.password = hashedPassword;
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const editUserPreferences = async ({ userId, userFavorites }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.displayFavorites = userFavorites;
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const addUserArtwork = async ({ userId, savedArtwork }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
    relations: ["artwork"],
  });
  foundUser.artwork.push(savedArtwork);
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const addUserComment = async ({ userId, savedComment }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
    relations: ["comments"],
  });
  foundUser.comments.push(savedComment);
  return await User.save(foundUser);
};

export const addSellerReview = async ({ userId, savedReview }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
    relations: ["reviews"],
  });
  foundUser.reviews.push(savedReview);
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const addUserLicense = async ({ savedLicense }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
    relations: ["licenses"],
  });
  foundUser.licenses.push(savedLicense);
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const addUserFavorite = async ({ userId, savedFavorite }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
    relations: ["favorites"],
  });
  foundUser.favorites.push(savedFavorite);
  return await User.save(foundUser);
};

// $TODO probably not how it's done
export const removeUserFavorite = async ({ userId, artworkId }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.favorites.filter((favorite) => favorite !== artworkId);
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const addUserNotification = async ({ userId, savedNotification }) => {
  const foundUser = User.findOne({
    where: [{ id: userId }],
    relations: ["notifications"],
  });
  return await foundUser.notifications.push(savedNotification);
};

// $Needs testing (mongo -> postgres)
export const addNewIntent = async ({ userId, versionId, intentId }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId }],
  });
  foundUser.intents.push(intentId);
  return await User.save(foundUser);
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
  return await User.save(foundUser);
};

// $Needs testing (mongo -> postgres)
export const editUserOrigin = async ({ foundUser, userBusinessAddress }) => {
  if (userBusinessAddress) foundUser.businessAddress = userBusinessAddress;
  return await User.save(foundUser);
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
  return await User.save(foundUser);
};
