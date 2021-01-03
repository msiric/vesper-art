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
const USER_AUTH_INFO = ["user.password", "user.jwtVersion"];

// $Needs testing (mongo -> postgres)
export const fetchUserById = async ({ userId }) => {
  const foundUser = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .select([
      ...USER_ESSENTIAL_INFO,
      ...USER_DETAILED_INFO,
      ...USER_VERIFICATION_INFO,
    ])
    .leftJoinAndSelect("user.avatar", "avatar")
    .where("user.id = :id AND user.active = :active", {
      id: userId,
      active: USER_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundUser);
  return foundUser;
};

// $Needs testing (mongo -> postgres)
export const fetchUserByEmail = async ({ userEmail }) => {
  const foundUser = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .select([
      ...USER_ESSENTIAL_INFO,
      ...USER_DETAILED_INFO,
      ...USER_VERIFICATION_INFO,
    ])
    .leftJoinAndSelect("user.avatar", "avatar")
    .where("user.email = :email AND user.active = :active", {
      email: userEmail,
      active: USER_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundUser);
  return foundUser;
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
    .select(USER_ESSENTIAL_INFO)
    .leftJoinAndSelect("user.avatar", "avatar")
    .where(
      "user.resetToken = :token AND user.resetExpiry = MoreThan(Date.now())",
      {
        token: tokenId,
      }
    )
    .getOne();
  console.log(foundUser);
  return foundUser;
};

// $Done (mongo -> postgres)
export const fetchUserByCreds = async ({ userUsername }) => {
  const data = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id")
    .where(
      "(user.name = :name OR user.email = :name) AND user.active = :active",
      { name: userUsername, active: true }
    )
    .getOne();
  const foundUser = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndMapMany(
      "user.intents",
      Intent,
      "intent",
      "intent.ownerId = :id",
      { id: data.id }
    )
    .leftJoinAndMapMany(
      "user.notifications",
      Notification,
      "notification",
      "notification.receiverId = :id AND notification.read = :read",
      { id: data.id, read: false }
    )
    .leftJoinAndMapMany(
      "user.favorites",
      Favorite,
      "favorite",
      "favorite.ownerId = :id",
      { id: data.id }
    )
    .where("user.id = :id", { id: data.id })
    .getOne();
  console.log(foundUser);
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
  /*   const foundUser = await User.findOne({ where: [{ id: userId }] });
  foundUser.stripeId = stripeId;
  return await User.save(foundUser); */

  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ stripeId })
    .where("id = :userId AND active = :active", {
      userId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
export const fetchUserProfile = async ({
  userUsername,
  dataSkip,
  dataLimit,
}) => {
  const data = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id")
    .where("user.name = :name AND user.active = :active", {
      name: userUsername,
      active: USER_ACTIVE_STATUS,
    })
    .getOne();
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
      { id: data.id, active: ARTWORK_ACTIVE_STATUS }
    )
    .leftJoinAndMapMany(
      "artwork.owner",
      User,
      "owner",
      "artwork.ownerId = :id",
      { id: data.id }
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
      active: USER_ACTIVE_STATUS,
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
// $TODO needs work
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
// $TODO needs work
export const editUserAvatar = async ({ foundUser, avatarUpload }) => {
  foundUser.avatar.source = avatarUpload.fileMedia;
  foundUser.avatar.dominant = avatarUpload.fileDominant;
  foundUser.avatar.orientation = avatarUpload.fileOrientation;
  foundUser.avatar.height = avatarUpload.fileHeight;
  foundUser.avatar.width = avatarUpload.fileWidth;
  return foundUser.avatar;
};

// $Needs testing (mongo -> postgres)
// $TODO how to conditionally update?
export const editUserProfile = async ({ foundUser, userData, savedAvatar }) => {
  if (savedAvatar) foundUser.avatar = savedAvatar;
  if (userData.userDescription)
    foundUser.description = userData.userDescription;
  if (userData.userCountry) foundUser.country = userData.userCountry;
  return await User.save(foundUser);

  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({})
    .where("id = :userId AND active = :active", {
      userId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
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
  /*   const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.email = userEmail;
  foundUser.verificationToken = verificationToken;
  foundUser.verified = false;
  return await User.save(foundUser); */

  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ email: userEmail, verificationToken, verified: false })
    .where("id = :userId AND active = :active", {
      userId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
export const editUserPassword = async ({ userId, userPassword }) => {
  const hashedPassword = await argon2.hash(userPassword);
  /*   const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.password = hashedPassword;
  return await User.save(foundUser); */

  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ password: hashedPassword })
    .where("id = :userId AND active = :active", {
      userId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
export const editUserPreferences = async ({ userId, userFavorites }) => {
  /*   const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.displayFavorites = userFavorites;
  return await User.save(foundUser); */

  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ displayFavorites: userFavorites })
    .where("id = :userId AND active = :active", {
      userId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
// $TODO needs to be saved to intents instead of user
export const addNewIntent = async ({ userId, versionId, intentId }) => {
  const foundUser = await User.findOne({
    where: [{ id: userId }],
  });
  foundUser.intents.push(intentId);
  return await User.save(foundUser);
};

// $TODO probably not how it's done
// $TODO needs to be removed from intents instead of user
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
  /*   if (userBusinessAddress) foundUser.businessAddress = userBusinessAddress;
  return await User.save(foundUser); */

  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ businessAddress: userBusinessAddress })
    .where("id = :userId AND active = :active", {
      userId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// needs testing (better way to update already found user)
// not tested
// needs transaction (not tested)
// $Needs testing (mongo -> postgres)
export const deactivateExistingUser = async ({ userId }) => {
  /*   const foundUser = await User.findOne({ where: [{ id: userId }] });
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
  return await User.save(foundUser); */

  const updatedUser = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({
      email: "",
      name: "",
      password: "",
      avatar: null,
      description: "",
      country: "",
      businessAddress: "",
      resetToken: "",
      resetExpiry: null,
      verificationToken: "",
      active: false,
    })
    .where("id = :userId AND active = :active", {
      userId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};
