import argon2 from "argon2";
import { getConnection } from "typeorm";
import { Artwork } from "../../entities/Artwork";
import { Avatar } from "../../entities/Avatar";
import { Favorite } from "../../entities/Favorite";
import { Intent } from "../../entities/Intent";
import { Notification } from "../../entities/Notification";
import { Order } from "../../entities/Order";
import { User } from "../../entities/User";

const USER_ACTIVE_STATUS = true;
const ARTWORK_ACTIVE_STATUS = true;
const USER_ESSENTIAL_INFO = [
  "user.id",
  "user.email",
  "user.name",
  "user.avatar",
  "user.description",
  "user.country",
  "user.active",
  "user.created",
];
const USER_DETAILED_INFO = [
  "user.businessAddress",
  "user.customWork",
  "user.displayFavorites",
  "user.stripeId",
];
const USER_VERIFICATION_INFO = [
  "user.resetToken",
  "user.resetExpiry",
  "user.jwtVersion",
  "user.verificationToken",
  "user.verified",
];
const USER_AUTH_INFO = [
  "user.password AS password",
  "user.jwtVersion AS jwtVersion",
];

// $Needs testing (mongo -> postgres)
export const fetchUserById = async ({ userId }) => {
  return await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.avatar", "avatar")
    .where("user.id = :id AND user.active = :active", {
      id: userId,
      active: USER_ACTIVE_STATUS,
    })
    .select([
      ...USER_ESSENTIAL_INFO,
      ...USER_DETAILED_INFO,
      ...USER_VERIFICATION_INFO,
    ])
    .getRawOne();
};

// $Needs testing (mongo -> postgres)
export const fetchUserByEmail = async ({ userEmail }) => {
  return await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.avatar", "avatar")
    .where("user.email = :email AND user.active = :active", {
      email: userEmail,
      active: USER_ACTIVE_STATUS,
    })
    .select([
      ...USER_ESSENTIAL_INFO,
      ...USER_DETAILED_INFO,
      ...USER_VERIFICATION_INFO,
    ])
    .getRawOne();
};

// $TODO convert to query builder
// $TODO not used?
export const fetchUserByToken = async ({ tokenId }) => {
  // return await User.findOne({
  //   where: [{ resetToken: tokenId, resetExpiry: { $gt: Date.now() } }],
  // });
  const foundUser = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.avatar", "avatar")
    .where(
      "user.resetToken = :token AND user.resetExpiry = MoreThan(Date.now())",
      {
        token: tokenId,
      }
    )
    .select(USER_ESSENTIAL_INFO)
    .getRawOne();
  return foundUser;
};

// $Done (mongo -> postgres)
export const fetchUserByCreds = async ({ userUsername }) => {
  const { userId } = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .where(
      "(user.name = :name OR user.email = :name) AND user.active = :active",
      { name: userUsername, active: true }
    )
    .select("user.id", "userId")
    .getRawOne();
  const foundUser = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndMapMany(
      "user.intents",
      Intent,
      "intent",
      "intent.ownerId = :id",
      { id: userId }
    )
    .leftJoinAndMapMany(
      "user.notifications",
      Notification,
      "notification",
      "notification.receiverId = :id AND notification.read = :read",
      { id: userId, read: false }
    )
    .leftJoinAndMapMany(
      "user.favorites",
      Favorite,
      "favorite",
      "favorite.ownerId = :id",
      { id: userId }
    )
    .where("user.id = :id", { id: userId })
    .getOne();
  return foundUser;
};

// $Needs testing (mongo -> postgres)
export const fetchUserPurchases = async ({ userId, dataSkip, dataLimit }) => {
  // return await Order.find({
  //   where: [{ buyerId: userId }],
  //   relations: ["seller", "version", "review"],
  //   skip: dataSkip,
  //   take: dataLimit,
  // });
  await getConnection()
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.seller", "seller")
    .leftJoinAndSelect("seller.avatar", "avatar")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.review", "review")
    .where("order.buyerId = :id", { id: userId })
    .getMany();
};

// $Needs testing (mongo -> postgres)
export const fetchUserSales = async ({ userId, dataSkip, dataLimit }) => {
  // return await Order.find({
  //   where: [{ sellerId: userId }],
  //   relations: ["buyer", "version", "review"],
  //   skip: dataSkip,
  //   take: dataLimit,
  // });
  await getConnection()
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.buyer", "buyer")
    .leftJoinAndSelect("buyer.avatar", "avatar")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.review", "review")
    .where("order.sellerId = :id", { id: userId })
    .getMany();
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
  const { userId } = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.name = :name AND user.active = :active", {
      name: userUsername,
      active: true,
    })
    .select("user.id", "userId")
    .getRawOne();
  const foundUser = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .select(USER_ESSENTIAL_INFO)
    .leftJoinAndSelect("user.avatar", "avatar")
    .leftJoinAndMapMany(
      "user.artwork",
      Artwork,
      "artwork",
      "artwork.ownerId = :id AND artwork.active = :active",
      { id: userId, active: ARTWORK_ACTIVE_STATUS }
    )
    .leftJoinAndMapMany(
      "artwork.owner",
      User,
      "owner",
      "artwork.ownerId = :id",
      { id: userId }
    )
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .where("user.name = :name AND user.active = :active", {
      name: userUsername,
      active: USER_ACTIVE_STATUS,
    })
    .getOne();
  return foundUser;
};

// $Needs testing (mongo -> postgres)
export const fetchUserArtwork = async ({ userId, dataCursor, dataCeiling }) => {
  // const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  // return await Artwork.find({
  //   where: [{ owner: userId, active: true }],
  //   relations: ["current"],
  //   skip: dataSkip,
  //   take: dataLimit,
  // });

  const foundArtwork = await getConnection()
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .where("artwork.ownerId = :id AND artwork.active = :active", {
      id: userId,
      active: active,
    })
    .getMany();
  console.log(foundArtwork);
  return foundArtwork;
};

// $Needs testing (mongo -> postgres)
export const fetchuserFavorites = async ({ userId, dataSkip, dataLimit }) => {
  // return await Favorite.find({
  //   where: [{ ownerId: userId }],
  //   relations: ["artwork", "artwork.owner", "artwork.current"],
  //   skip: dataSkip,
  //   take: dataLimit,
  // });

  const foundFavorites = await getConnection()
    .getRepository(Favorite)
    .createQueryBuilder("favorite")
    .leftJoinAndSelect("favorite.artwork", "artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .where("artwork.ownerId = :id", {
      id: userId,
    })
    .getMany();
  console.log(foundFavorites);
  return foundFavorites;
};

// $Needs testing (mongo -> postgres)
export const fetchUserStatistics = async ({ userId }) => {
  // return await User.findOne({
  //   where: [{ id: userId, active: true }],
  //   relations: [
  //     "purchases",
  //     "sales",
  //     "purchases.version",
  //     "purchases.license",
  //     "sales.version",
  //     "sales.license",
  //   ],
  // });

  const foundStatistics = await getConnection()
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("order.license", "license")
    .where(
      "order.buyerId = :userId AND order.active = :active) OR (order.sellerId = :userId AND order.active = :active)",
      {
        userId: userId,
        active: true,
      }
    )
    .getMany();
  console.log(foundStatistics);
  return foundStatistics;
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
  // return await Notification.find({
  //   where: [{ receiver: userId }],
  //   skip: dataSkip,
  //   take: dataLimit,
  //   relations: ["user"],
  //   order: {
  //     created: "DESC",
  //   },
  // });

  const foundNotifications = await getConnection()
    .getRepository(Notification)
    .createQueryBuilder("notification")
    .where("notification.receiverId = :userId", {
      userId: userId,
    })
    .addOrderBy("notification.created", "DESC")
    .getMany();
  console.log(foundNotifications);
  return foundNotifications;
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
