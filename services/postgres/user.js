import { Artwork } from "../../entities/Artwork";
import { Avatar } from "../../entities/Avatar";
import { Favorite } from "../../entities/Favorite";
import { Intent } from "../../entities/Intent";
import { Notification } from "../../entities/Notification";
import { Order } from "../../entities/Order";
import { Review } from "../../entities/Review";
import { User } from "../../entities/User";
import { calculateRating, resolveSubQuery } from "../../utils/helpers";
import {
  ARTWORK_SELECTION,
  AVATAR_SELECTION,
  COVER_SELECTION,
  FAVORITE_SELECTION,
  INTENT_SELECTION,
  LICENSE_SELECTION,
  MEDIA_SELECTION,
  NOTIFICATION_SELECTION,
  ORDER_SELECTION,
  REVIEW_SELECTION,
  USER_SELECTION,
  VERSION_SELECTION,
} from "../../utils/selectors";

export const fetchUserIdByCreds = async ({
  userUsername,
  userEmail,
  connection,
}) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([...USER_SELECTION["STRIPPED_INFO"]()])
    .where(
      "(user.name = :name OR user.email = :email) AND user.active = :active",
      {
        name: userUsername,
        email: userEmail,
        active: USER_SELECTION["ACTIVE_STATUS"],
      }
    )
    .getOne();
  return foundUser ? foundUser.id : null;
};

export const fetchUserIdByUsername = async ({ userUsername, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([...USER_SELECTION["STRIPPED_INFO"]()])
    .where("user.name = :name AND user.active = :active", {
      name: userUsername,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .getOne();
  return foundUser ? foundUser.id : null;
};

export const fetchUserIdByEmail = async ({ userEmail, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([...USER_SELECTION["STRIPPED_INFO"]()])
    .where("user.email = :email AND user.active = :active", {
      email: userEmail,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .getOne();
  return foundUser ? foundUser.id : null;
};

export const fetchUserIdByVerificationToken = async ({
  tokenId,
  connection,
}) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([...USER_SELECTION["STRIPPED_INFO"]()])
    .where(
      "user.verificationToken = :tokenId AND user.verificationExpiry > :dateNow AND user.active = :active",
      {
        tokenId,
        dateNow: new Date(),
        active: USER_SELECTION["ACTIVE_STATUS"],
      }
    )
    .getOne();
  return foundUser ? foundUser.id : null;
};

export const fetchUserResetTokenById = async ({ userId, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([
      ...USER_SELECTION["STRIPPED_INFO"](),
      ...USER_SELECTION["AUTH_INFO"](),
      ...USER_SELECTION["VERIFICATION_INFO"](),
    ])
    .where(
      "user.id = :userId AND user.resetExpiry > :dateNow AND user.active = :active",
      {
        userId,
        dateNow: new Date(),
        active: USER_SELECTION["ACTIVE_STATUS"],
      }
    )
    .getOne();
  return foundUser;
};

// $Needs testing (mongo -> postgres)
export const fetchUserById = async ({ userId, selection, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.avatar", "avatar")
    .select([
      ...USER_SELECTION["STRIPPED_INFO"](),
      ...(selection ? selection : []),
    ])
    .where("user.id = :userId AND user.active = :active", {
      userId,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .getOne();
  return foundUser;
};

export const fetchUserByUsername = async ({
  userUsername,
  selection,
  connection,
}) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([
      ...USER_SELECTION["STRIPPED_INFO"](),
      ...USER_SELECTION["DETAILED_INFO"](),
      ...(selection ? selection : []),
    ])
    .leftJoinAndSelect("user.avatar", "avatar")
    .where("user.name = :userUsername AND user.active = :active", {
      userUsername,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .getOne();
  return foundUser;
};

// $Needs testing (mongo -> postgres)
export const fetchUserByEmail = async ({ userEmail, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([
      ...USER_SELECTION["STRIPPED_INFO"](),
      ...USER_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["VERIFICATION_INFO"](),
    ])
    .leftJoinAndSelect("user.avatar", "avatar")
    .where("user.email = :email AND user.active = :active", {
      email: userEmail,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .getOne();
  return foundUser;
};

export const fetchUserByResetToken = async ({ tokenHash, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .select([
      ...USER_SELECTION["STRIPPED_INFO"](),
      ...USER_SELECTION["AUTH_INFO"](),
    ])
    .leftJoinAndSelect("user.avatar", "avatar")
    .where(
      "user.resetToken = :tokenHash AND user.resetExpiry > :dateNow AND user.active = :active",
      {
        tokenHash,
        dateNow: new Date(),
        active: USER_SELECTION["ACTIVE_STATUS"],
      }
    )
    .getOne();
  return foundUser;
};

// $Done (mongo -> postgres)
export const fetchUserByAuth = async ({ userId, connection }) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.avatar", "avatar")
    .leftJoinAndMapMany(
      "user.notifications",
      Notification,
      "notification",
      "notification.receiverId = :userId AND notification.read = :read",
      // $TODO read const
      { userId, read: false }
    )
    .leftJoinAndMapMany(
      "user.favorites",
      Favorite,
      "favorite",
      "favorite.ownerId = :userId",
      { userId }
    )
    .select([
      ...USER_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["AUTH_INFO"](),
      ...USER_SELECTION["VERIFICATION_INFO"](),
      ...USER_SELECTION["STRIPE_INFO"](),
      ...USER_SELECTION["LICENSE_INFO"](),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"](),
      ...NOTIFICATION_SELECTION["STRIPPED_INFO"](),
      ...FAVORITE_SELECTION["ESSENTIAL_INFO"](),
      ...FAVORITE_SELECTION["ARTWORK_INFO"](),
    ])
    // $TODO verified doesn't need to be checked (it's done in all the controllers)
    .where("user.id = :userId AND user.active = :active", {
      userId,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .getOne();
  // temporary hacky solution
  if (foundUser) {
    foundUser.notifications = foundUser.notifications.length;
  }
  return foundUser;
};

// $TODO add appropriate visiblity tag
export const fetchSellerMedia = async ({ userId, artworkId, connection }) => {
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.media", "media")
    .select([...MEDIA_SELECTION["ESSENTIAL_INFO"]()])
    .where(
      "artwork.id = :artworkId AND artwork.active = :active AND artwork.ownerId = :userId",
      {
        artworkId,
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
        userId,
      }
    )
    .getOne();
  return foundArtwork && foundArtwork.current ? foundArtwork.current.media : {};
};

// $Needs testing (mongo -> postgres)
// $TODO remove @AfterLoad for earned, spent and fee
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
    .leftJoinAndSelect("order.license", "license")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.review", "review")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...ORDER_SELECTION["BUYER_SPENT"](),
      ...USER_SELECTION["STRIPPED_INFO"]("seller"),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ASSIGNOR_INFO"](),
      ...LICENSE_SELECTION["USAGE_INFO"](),
    ])
    .where(
      `order.buyerId = :userId AND order.serial > 
      ${resolveSubQuery(queryBuilder, "order", Order, cursor, -1)}`,
      { userId }
    )
    .orderBy("order.serial", "ASC")
    .limit(limit)
    .getMany();
  return foundPurchases;
};

export const fetchArtworkOrders = async ({ userId, versionId, connection }) => {
  const foundPurchases = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.license", "license")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["USAGE_INFO"](),
      ...LICENSE_SELECTION["ASSIGNOR_INFO"](),
    ])
    .where("order.buyerId = :userId AND order.versionId = :versionId", {
      userId,
      versionId,
    })
    .getMany();
  return foundPurchases;
};

export const fetchUserPurchasesWithMedia = async ({
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
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("version.media", "media")
    .leftJoinAndSelect("order.review", "review")
    .distinctOn(["order.artworkId"])
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("seller"),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...MEDIA_SELECTION["ESSENTIAL_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      `order.buyerId = :userId AND order.serial > 
      ${resolveSubQuery(queryBuilder, "order", Order, cursor, -1)}`,
      { userId }
    )
    .limit(limit)
    .getMany();
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
    .leftJoinAndSelect("order.license", "license")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.review", "review")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...ORDER_SELECTION["SELLER_EARNED"](),
      ...USER_SELECTION["STRIPPED_INFO"]("buyer"),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      `order.sellerId = :userId AND order.serial > 
      ${resolveSubQuery(queryBuilder, "order", Order, cursor, -1)}`,
      { userId }
    )
    .orderBy("order.serial", "ASC")
    .limit(limit)
    .getMany();
  return foundSales;
};

export const fetchUserReviews = async ({ userId, connection }) => {
  const foundReviews = await connection
    .getRepository(Review)
    .createQueryBuilder("review")
    .select([...REVIEW_SELECTION["ESSENTIAL_INFO"]()])
    .where("review.revieweeId = :userId", {
      userId,
    })
    .getMany();
  return foundReviews;
};

// $Needs testing (mongo -> postgres)
// $TODO add appropriate visiblity tag
export const fetchUserProfile = async ({
  userUsername,
  userId,
  connection,
}) => {
  const foundUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.avatar", "avatar")
    .leftJoinAndMapMany(
      "user.reviews",
      Review,
      "review",
      "review.revieweeId = :userId",
      { userId }
    )
    .select([
      ...USER_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["DETAILED_INFO"](),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where("user.name = :name AND user.active = :active", {
      name: userUsername,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .getOne();
  if (foundUser) {
    foundUser.rating = calculateRating({
      active: foundUser.active,
      reviews: foundUser.reviews,
    });
  }
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
    .select([
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("owner"),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      `artwork.ownerId = :userId AND artwork.active = :active AND artwork.visibility = :visibility AND artwork.serial > 
      ${resolveSubQuery(queryBuilder, "artwork", Artwork, cursor, -1)}`,
      {
        userId,
        active: USER_SELECTION["ACTIVE_STATUS"],
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
      }
    )
    .orderBy("artwork.serial", "ASC")
    .limit(limit)
    .getMany();
  return foundArtwork;
};

export const fetchUserUploadsWithMedia = async ({
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
    .leftJoinAndSelect("version.media", "media")
    .select([
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("owner"),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...MEDIA_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      `artwork.ownerId = :userId AND artwork.active = :active AND artwork.serial > 
      ${resolveSubQuery(queryBuilder, "artwork", Artwork, cursor, -1)}`,
      {
        userId,
        active: USER_SELECTION["ACTIVE_STATUS"],
      }
    )
    .orderBy("artwork.serial", "ASC")
    .limit(limit)
    .getMany();
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
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("version.media", "media")
    .select([
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...MEDIA_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      `artwork.ownerId = :userId AND artwork.active = :active AND artwork.serial > 
      ${resolveSubQuery(queryBuilder, "artwork", Artwork, cursor, -1)}`,
      {
        userId,
        active: USER_SELECTION["ACTIVE_STATUS"],
      }
    )
    .orderBy("artwork.serial", "ASC")
    .limit(limit)
    .getMany();
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
    .select([
      ...FAVORITE_SELECTION["ESSENTIAL_INFO"](),
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("owner"),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      `favorite.ownerId = :userId AND artwork.active = :active AND artwork.visibility = :visibility AND favorite.serial > 
      ${resolveSubQuery(queryBuilder, "favorite", Favorite, cursor, -1)}`,
      {
        userId,
        active: USER_SELECTION["ACTIVE_STATUS"],
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
      }
    )
    .orderBy("favorite.serial", "ASC")
    .limit(limit)
    .getMany();
  return foundFavorites;
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
    .select([...NOTIFICATION_SELECTION["ESSENTIAL_INFO"]()])
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
  return foundNotifications;
};

export const fetchIntentByParents = async ({
  userId,
  versionId,
  connection,
}) => {
  const foundIntent = await connection
    .getRepository(Intent)
    .createQueryBuilder("intent")
    .select([...INTENT_SELECTION["ESSENTIAL_INFO"]()])
    .where("intent.ownerId = :userId AND intent.versionId = :versionId", {
      userId,
      versionId,
    })
    .getOne();
  return foundIntent;
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
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .execute();
  return updatedUser;
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
  return deletedAvatar;
};

// $Needs testing (mongo -> postgres)
// $TODO how to conditionally update?
export const editUserProfile = async ({
  foundUser,
  userDescription = "",
  userCountry = "",
  avatarId,
  connection,
}) => {
  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({
      avatarId: avatarId,
      description: userDescription,
      country: userCountry,
    })
    .where("id = :userId AND active = :active", {
      userId: foundUser.id,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .execute();
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
export const editUserEmail = async ({
  userId,
  userEmail,
  verificationToken,
  verificationExpiry,
  verified,
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
      verificationExpiry,
      verified,
    })
    .where("id = :userId AND active = :active", {
      userId,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .execute();
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
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .execute();
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

  // $TODO teska debilana
  const displayFavorites = userFavorites === "true";

  const updatedUser = await connection
    .createQueryBuilder()
    .update(User)
    .set({ displayFavorites })
    .where("id = :userId AND active = :active", {
      userId,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .execute();
  return updatedUser;
};

// $Needs testing (mongo -> postgres)
export const addNewIntent = async ({
  intentId,
  userId,
  versionId,
  connection,
}) => {
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
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .execute();
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
      email: null,
      fullName: "",
      name: null,
      password: "",
      avatar: null,
      customWork: false,
      displayFavorites: false,
      jwtVersion: 0,
      verified: false,
      description: "",
      country: "",
      businessAddress: "",
      resetToken: "",
      resetExpiry: null,
      verificationToken: "",
      verificationExpiry: null,
      active: false,
      created: null,
      updated: null,
    })
    .where("id = :userId AND active = :active", {
      userId,
      active: USER_SELECTION["ACTIVE_STATUS"],
    })
    .execute();
  return updatedUser;
};
