import { addHours, formatISO } from "date-fns";
import { Artwork } from "../../entities/Artwork";
import { Avatar } from "../../entities/Avatar";
import { Favorite } from "../../entities/Favorite";
import { Intent } from "../../entities/Intent";
import { Notification } from "../../entities/Notification";
import { Order } from "../../entities/Order";
import { Review } from "../../entities/Review";
import { User } from "../../entities/User";
import { calculateRating, resolveSubQuery } from "../../utils/helpers";

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
const USER_STRIPE_INFO = ["user.businessAddress", "user.stripeId"];
const USER_DETAILED_INFO = ["user.customWork", "user.displayFavorites"];
const USER_VERIFICATION_INFO = [
  "user.resetToken",
  "user.resetExpiry",
  "user.jwtVersion",
  "user.verificationToken",
  "user.verificationExpiry",
  "user.verified",
];
const USER_AUTH_INFO = ["user.password", "user.jwtVersion"];

export const fetchUserIdByCreds = async ({ userUsername, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id")
    .where(
      "(user.name = :name OR user.email = :name) AND user.active = :active",
      { name: userUsername, active: USER_ACTIVE_STATUS }
    )
    .getOne();
  console.log(foundUser);
  return foundUser ? foundUser.id : null;
};

export const fetchUserIdByUsername = async ({ userUsername, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id")
    .where("user.name = :name AND user.active = :active", {
      name: userUsername,
      active: USER_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundUser);
  return foundUser ? foundUser.id : null;
};

export const fetchUserIdByEmail = async ({ userEmail, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id")
    .where("user.email = :email AND user.active = :active", {
      email: userEmail,
      active: USER_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundUser);
  return foundUser ? foundUser.id : null;
};

export const fetchUserIdByVerificationToken = async ({
  tokenId,
  connection,
}) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.id")
    .where(
      "user.verificationToken = :tokenId AND user.verificationExpiry > :dateNow AND user.active = :active",
      {
        tokenId,
        dateNow: formatISO(new Date()),
        // $TODO add constant
        active: true,
      }
    )
    .getOne();
  console.log(foundUser);
  return foundUser ? foundUser.id : null;
};

// $Needs testing (mongo -> postgres)
export const fetchUserById = async ({ userId, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([
      ...USER_ESSENTIAL_INFO,
      ...USER_STRIPE_INFO,
      ...USER_DETAILED_INFO,
      ...USER_VERIFICATION_INFO,
    ])
    .leftJoinAndSelect("user.avatar", "avatar")
    .where("user.id = :userId AND user.active = :active", {
      userId,
      active: USER_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundUser);
  return foundUser;
};

export const fetchUserByUsername = async ({ userUsername, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([
      ...USER_ESSENTIAL_INFO,
      ...USER_STRIPE_INFO,
      ...USER_DETAILED_INFO,
      ...USER_VERIFICATION_INFO,
    ])
    .leftJoinAndSelect("user.avatar", "avatar")
    .where("user.name = :userUsername AND user.active = :active", {
      userUsername,
      active: USER_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundUser);
  return foundUser;
};

// $Needs testing (mongo -> postgres)
export const fetchUserByEmail = async ({ userEmail, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([
      ...USER_ESSENTIAL_INFO,
      ...USER_STRIPE_INFO,
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

export const fetchUserByResetToken = async ({ tokenId, connection }) => {
  // return await User.findOne({
  //   where: [{ resetToken: tokenId, resetExpiry: { $gt: Date.now() } }],
  // });
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([
      ...USER_ESSENTIAL_INFO,
      ...USER_AUTH_INFO,
      ...USER_VERIFICATION_INFO,
    ])
    .leftJoinAndSelect("user.avatar", "avatar")
    .where("user.resetToken = :token AND user.resetExpiry > :dateNow", {
      token: tokenId,
      dateNow: formatISO(new Date()),
    })
    .getOne();
  console.log(foundUser);
  return foundUser;
};

// $Done (mongo -> postgres)
export const fetchUserByAuth = async ({ userId, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.avatar", "avatar")
    .leftJoinAndMapMany(
      "user.intents",
      Intent,
      "intent",
      "intent.ownerId = :userId",
      { userId }
    )
    .leftJoinAndMapMany(
      "user.notifications",
      Notification,
      "notification",
      "notification.receiverId = :userId AND notification.read = :read",
      { userId, read: false }
    )
    .leftJoinAndMapMany(
      "user.favorites",
      Favorite,
      "favorite",
      "favorite.ownerId = :userId",
      { userId }
    )
    .where("user.id = :userId", { userId })
    .getOne();
  // temporary hacky solution
  foundUser.notifications = foundUser.notifications.length;
  console.log(foundUser);
  return foundUser;
};

// $TODO add appropriate visiblity tag
export const fetchSellerMedia = async ({ userId, artworkId, connection }) => {
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.media", "media")
    .where(
      "artwork.id = :artworkId AND artwork.active = :active AND artwork.ownerId = :userId",
      {
        artworkId,
        active: ARTWORK_ACTIVE_STATUS,
        userId,
      }
    )
    .getOne();
  console.log(foundArtwork.current.media);
  return foundArtwork.current.media;
};

// $Needs testing (mongo -> postgres)
export const fetchUserPurchases = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  // return await Order.find({
  //   where: [{ buyerId: userId }],
  //   relations: ["seller", "version", "review"],
  //   skip: cursor,
  //   take: limit,
  // });

  const queryBuilder = await connection
    .getRepository(Order)
    .createQueryBuilder("order");
  const foundPurchases = await queryBuilder
    .leftJoinAndSelect("order.seller", "seller")
    .leftJoinAndSelect("seller.avatar", "avatar")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.review", "review")
    .where(
      `order.buyerId = :userId AND order.serial > 
      ${resolveSubQuery(queryBuilder, "order", Order, cursor, -1)}`,
      { userId }
    )
    .orderBy("order.serial", "ASC")
    .limit(limit)
    .getMany();
  console.log(foundPurchases);
  return foundPurchases;
};

// $Needs testing (mongo -> postgres)
export const fetchUserSales = async ({ userId, cursor, limit, connection }) => {
  // return await Order.find({
  //   where: [{ sellerId: userId }],
  //   relations: ["buyer", "version", "review"],
  //   skip: cursor,
  //   take: limit,
  // });

  const queryBuilder = await connection
    .getRepository(Order)
    .createQueryBuilder("order");
  const foundSales = await queryBuilder
    .leftJoinAndSelect("order.buyer", "buyer")
    .leftJoinAndSelect("buyer.avatar", "avatar")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.review", "review")
    .where(
      `order.sellerId = :userId AND order.serial > 
      ${resolveSubQuery(queryBuilder, "order", Order, cursor, -1)}`,
      { userId }
    )
    .orderBy("order.serial", "ASC")
    .limit(limit)
    .getMany();
  console.log(foundSales);
  return foundSales;
};

export const fetchUserReviews = async ({ userId, connection }) => {
  const foundReviews = await connection
    .getRepository(Review)
    .createQueryBuilder("review")
    .where("review.revieweeId = :userId", {
      userId,
    })
    .getMany();
  console.log(foundReviews);
  return foundReviews;
};

// $Needs testing (mongo -> postgres)
export const editUserStripe = async ({ userId, stripeId, connection }) => {
  /*   const foundUser = await User.findOne({ where: [{ id: userId }] });
  foundUser.stripeId = stripeId;
  return await User.save(foundUser); */

  const updatedUser = await connection
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
// $TODO add appropriate visiblity tag
export const fetchUserProfile = async ({
  userUsername,
  userId,
  cursor,
  limit,
  connection,
}) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([...USER_ESSENTIAL_INFO, ...USER_DETAILED_INFO])
    .leftJoinAndSelect("user.avatar", "avatar")
    .leftJoinAndMapMany(
      "user.reviews",
      Review,
      "review",
      "review.revieweeId = :userId",
      { userId }
    )
    .leftJoinAndMapMany(
      "user.artwork",
      Artwork,
      "artwork",
      "artwork.ownerId = :userId AND artwork.active = :active",
      { userId, active: ARTWORK_ACTIVE_STATUS }
    )
    .leftJoinAndMapOne(
      "artwork.owner",
      User,
      "owner",
      "artwork.ownerId = :userId",
      { userId }
    )
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .where("user.name = :name AND user.active = :active", {
      name: userUsername,
      active: USER_ACTIVE_STATUS,
    })
    .getOne();
  foundUser.rating = calculateRating({
    reviews: foundUser.reviews,
  });
  return foundUser;
};

// $Needs testing (mongo -> postgres)
// $TODO add appropriate visiblity tag
export const fetchUserArtwork = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  //
  // return await Artwork.find({
  //   where: [{ owner: userId, active: true }],
  //   relations: ["current"],
  //   skip: cursor,
  //   take: limit,
  // });

  const queryBuilder = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork");
  const foundArtwork = await queryBuilder
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("version.cover", "cover")
    .where(
      `artwork.ownerId = :userId AND artwork.active = :active AND artwork.serial > 
      ${resolveSubQuery(queryBuilder, "artwork", Artwork, cursor, -1)}`,
      {
        userId,
        active: USER_ACTIVE_STATUS,
      }
    )
    .orderBy("artwork.serial", "ASC")
    .limit(limit)
    .getMany();
  console.log(foundArtwork);
  return foundArtwork;
};

export const fetchUserMedia = async ({ userId, cursor, limit, connection }) => {
  //
  // return await Artwork.find({
  //   where: [{ owner: userId, active: true }],
  //   relations: ["current"],
  //   skip: cursor,
  //   take: limit,
  // });

  const queryBuilder = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork");
  const foundArtwork = await queryBuilder
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("version.media", "media")
    .where(
      `artwork.ownerId = :userId AND artwork.active = :active AND artwork.serial > 
      ${resolveSubQuery(queryBuilder, "artwork", Artwork, cursor, -1)}`,
      {
        userId,
        active: USER_ACTIVE_STATUS,
      }
    )
    .orderBy("artwork.serial", "ASC")
    .limit(limit)
    .getMany();
  console.log(foundArtwork);
  return foundArtwork;
};

// $Needs testing (mongo -> postgres)
export const fetchUserFavorites = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  // return await Favorite.find({
  //   where: [{ ownerId: userId }],
  //   relations: ["artwork", "artwork.owner", "artwork.current"],
  //   skip: cursor,
  //   take: limit,
  // });

  const queryBuilder = await connection
    .getRepository(Favorite)
    .createQueryBuilder("favorite");
  const foundFavorites = await queryBuilder
    .leftJoinAndSelect("favorite.artwork", "artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .where(
      `favorite.ownerId = :userId AND favorite.serial > 
      ${resolveSubQuery(queryBuilder, "favorite", Favorite, cursor, -1)}`,
      {
        userId,
      }
    )
    .orderBy("favorite.serial", "ASC")
    .limit(limit)
    .getMany();
  console.log(foundFavorites);
  return foundFavorites;
};

// $Needs testing (mongo -> postgres)
export const fetchUserStatistics = async ({ userId, connection }) => {
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

  const foundStatistics = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.seller", "seller")
    .leftJoinAndSelect("seller.avatar", "avatar")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.review", "review")
    .leftJoinAndSelect("order.license", "license")
    .where(
      "order.buyerId = :userId AND order.status = :status OR order.sellerId = :userId AND order.status = :status",
      {
        userId,
        // $TODO to const
        status: "completed",
      }
    )
    .getMany();
  console.log(foundStatistics);
  return foundStatistics;
};

// $Needs testing (mongo -> postgres)
// $TODO needs work
export const addUserAvatar = async ({
  avatarId,
  userId,
  avatarUpload,
  connection,
}) => {
  // const newAvatar = new Avatar();
  // newAvatar.source = avatarUpload.fileMedia;
  // newAvatar.dominant = avatarUpload.fileDominant;
  // newAvatar.orientation = avatarUpload.fileOrientation;
  // newAvatar.height = avatarUpload.fileHeight;
  // newAvatar.width = avatarUpload.fileWidth;
  // return newAvatar;

  const savedAvatar = await connection
    .createQueryBuilder()
    .insert()
    .into(Avatar)
    .values([
      {
        id: avatarId,
        source: avatarUpload.fileMedia,
        dominant: avatarUpload.fileDominant,
        orientation: avatarUpload.fileOrientation,
        height: avatarUpload.fileHeight,
        width: avatarUpload.fileWidth,
        ownerId: userId,
      },
    ])
    .execute();
  console.log(savedAvatar);
  return savedAvatar;
};

// $Needs testing (mongo -> postgres)
// $TODO needs work
export const editUserAvatar = async ({ userId, avatarUpload, connection }) => {
  // foundUser.avatar.source = avatarUpload.fileMedia;
  // foundUser.avatar.dominant = avatarUpload.fileDominant;
  // foundUser.avatar.orientation = avatarUpload.fileOrientation;
  // foundUser.avatar.height = avatarUpload.fileHeight;
  // foundUser.avatar.width = avatarUpload.fileWidth;
  // return foundUser.avatar;

  const updatedAvatar = await connection
    .createQueryBuilder()
    .update(Avatar)
    .set({
      source: avatarUpload.fileMedia,
      dominant: avatarUpload.fileDominant,
      orientation: avatarUpload.fileOrientation,
      height: avatarUpload.fileHeight,
      width: avatarUpload.fileWidth,
      ownerId: userId,
    })
    .where('"ownerId" = :userId', {
      userId,
    })
    .returning("*")
    .execute();
  console.log(updatedAvatar);
  return updatedAvatar;
};

export const removeUserAvatar = async ({ userId, avatarId, connection }) => {
  const deletedAvatar = await connection
    .createQueryBuilder()
    .delete()
    .from(Avatar)
    .where('id = :avatarId AND "ownerId" = :userId', {
      avatarId,
      userId,
    })
    .execute();
  console.log(deletedAvatar);
  return deletedAvatar;
};

// $Needs testing (mongo -> postgres)
// $TODO how to conditionally update?
export const editUserProfile = async ({
  foundUser,
  userData,
  avatarId,
  connection,
}) => {
  // if (savedAvatar) foundUser.avatar = savedAvatar;
  // if (userData.userDescription)
  //   foundUser.description = userData.userDescription;
  // if (userData.userCountry) foundUser.country = userData.userCountry;
  // return await User.save(foundUser);

  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({
      avatarId: avatarId,
      description: userData.userDescription
        ? userData.userDescription
        : foundUser.description,
      country: userData.userCountry ? userData.userCountry : foundUser.country,
    })
    .where("id = :userId AND active = :active", {
      userId: foundUser.id,
      // $TODO wat?
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
export const fetchUserNotifications = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  // return await Notification.find({
  //   where: [{ receiver: userId }],
  //   skip: cursor,
  //   take: limit,
  //   relations: ["user"],
  //   order: {
  //     created: "DESC",
  //   },
  // });

  const queryBuilder = await connection
    .getRepository(Notification)
    .createQueryBuilder("notification");
  const foundNotifications = await queryBuilder
    .where(
      `notification.receiverId = :userId AND notification.serial < 
      ${resolveSubQuery(
        queryBuilder,
        "notification",
        Notification,
        cursor,
        Number.MAX_VALUE
      )}`,
      {
        userId,
      }
    )
    .orderBy("notification.serial", "DESC")
    .limit(limit)
    .getMany();
  console.log(foundNotifications);
  return foundNotifications;
};

// $Needs testing (mongo -> postgres)
export const editUserEmail = async ({
  userId,
  userEmail,
  verificationToken,
  connection,
}) => {
  /*   const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.email = userEmail;
  foundUser.verificationToken = verificationToken;
  foundUser.verified = false;
  return await User.save(foundUser); */

  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({
      email: userEmail,
      verificationToken,
      verificationExpiry: formatISO(addHours(new Date(), 1)),
      verified: false,
    })
    .where("id = :userId AND active = :active", {
      userId,
      // $TODO wat?
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
export const editUserPassword = async ({
  userId,
  hashedPassword,
  connection,
}) => {
  /*   const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.password = hashedPassword;
  return await User.save(foundUser); */

  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ password: hashedPassword })
    .where("id = :userId AND active = :active", {
      userId,
      // $TODO wat?
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
export const editUserPreferences = async ({
  userId,
  userFavorites,
  connection,
}) => {
  /*   const foundUser = await User.findOne({
    where: [{ id: userId, active: true }],
  });
  foundUser.displayFavorites = userFavorites;
  return await User.save(foundUser); */

  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ displayFavorites: userFavorites })
    .where("id = :userId AND active = :active", {
      userId,
      // $TODO wat?
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};

export const fetchIntentByCreds = async ({
  intentId,
  userId,
  versionId,
  connection,
}) => {
  const foundIntent = await connection
    .getRepository(Intent)
    .createQueryBuilder("intent")
    .where(
      "intent.id = :intentId AND intent.ownerId = :userId AND intent.versionId = :versionId",
      {
        intentId,
        userId,
        versionId,
      }
    )
    .getOne();
  console.log(foundIntent);
  return foundIntent;
};

export const fetchIntentByParents = async ({
  userId,
  versionId,
  connection,
}) => {
  const foundIntent = await connection
    .getRepository(Intent)
    .createQueryBuilder("intent")
    .where("intent.ownerId = :userId AND intent.versionId = :versionId", {
      userId,
      versionId,
    })
    .getOne();
  console.log(foundIntent);
  return foundIntent;
};

// $Needs testing (mongo -> postgres)
export const addNewIntent = async ({
  intentId,
  userId,
  versionId,
  connection,
}) => {
  console.log("INTENT CREATION", intentId, userId, versionId);
  const savedIntent = await connection
    .createQueryBuilder()
    .insert()
    .into(Intent)
    .values([
      {
        id: intentId,
        ownerId: userId,
        versionId,
      },
    ])
    .execute();
  console.log(savedIntent);
  return savedIntent;
};

export const removeExistingIntent = async ({ intentId, connection }) => {
  const deletedIntent = await connection
    .createQueryBuilder()
    .delete()
    .from(Intent)
    .where("id = :intentId", {
      intentId,
    })
    .execute();
  console.log(deletedIntent);
  return deletedIntent;
};

// $Needs testing (mongo -> postgres)
export const editUserOrigin = async ({
  userId,
  userBusinessAddress,
  connection,
}) => {
  /*   if (userBusinessAddress) foundUser.businessAddress = userBusinessAddress;
  return await User.save(foundUser); */

  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ businessAddress: userBusinessAddress })
    .where("id = :userId AND active = :active", {
      userId,
      // $TODO wat?
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
export const deactivateExistingUser = async ({ userId, connection }) => {
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

  const updatedUser = await connection
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
      verificationExpiry: null,
      active: false,
    })
    .where("id = :userId AND active = :active", {
      userId,
      // $TODO wat?
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedUser);
  return updatedUser;
};
