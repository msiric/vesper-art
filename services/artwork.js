import { Like } from "@entities/Like";
import { Tag } from "@entities/Tag";
import { View } from "@entities/View";
import { upload } from "../common/constants";
import { Artwork } from "../entities/Artwork";
import { Comment } from "../entities/Comment";
import { Cover } from "../entities/Cover";
import { Favorite } from "../entities/Favorite";
import { Media } from "../entities/Media";
import { Order } from "../entities/Order";
import { Review } from "../entities/Review";
import { Version } from "../entities/Version";
import {
  ARTWORK_SELECTION,
  AVATAR_SELECTION,
  COMMENT_SELECTION,
  COVER_SELECTION,
  FAVORITE_SELECTION,
  LIKE_SELECTION,
  MEDIA_SELECTION,
  ORDER_SELECTION,
  resolveSubQuery,
  REVIEW_SELECTION,
  USER_SELECTION,
  VERSION_SELECTION,
  VIEW_SELECTION,
} from "../utils/database";
import { calculateRating } from "../utils/helpers";

export const fetchArtworkById = async ({ artworkId, connection }) => {
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .select([
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...ARTWORK_SELECTION["OWNER_INFO"](),
    ])
    .where(
      "artwork.id = :artworkId AND artwork.visibility = :visibility AND artwork.active = :active",
      {
        artworkId,
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
      }
    )
    .getOne();
  return foundArtwork;
};

export const fetchAllArtworks = async ({ cursor, limit, connection }) => {
  const queryBuilder = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork");
  const foundArtwork = await queryBuilder
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("artwork.owner", "owner")
    .select([
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("owner"),
    ])
    .where(
      `artwork.serial < 
      ${resolveSubQuery(
        queryBuilder,
        "artwork",
        Artwork,
        cursor,
        Number.MAX_VALUE
      )}`
    )
    .orderBy("artwork.serial", "DESC")
    .limit(limit)
    .getMany();
  return foundArtwork;
};

export const fetchActiveArtworks = async ({ cursor, limit, connection }) => {
  const queryBuilder = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork");
  const foundArtwork = await queryBuilder
    .leftJoinAndSelect("artwork.current", "version")
    .loadRelationCountAndMap("artwork.favorites", "artwork.favorites")
    .loadRelationCountAndMap("artwork.comments", "artwork.comments")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("artwork.owner", "owner")
    .select([
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("owner"),
    ])
    .where(
      `artwork.active = :active AND artwork.visibility = :visibility AND artwork.serial < 
      ${resolveSubQuery(
        queryBuilder,
        "artwork",
        Artwork,
        cursor,
        Number.MAX_VALUE
      )}`,
      {
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
      }
    )
    .orderBy("artwork.serial", "DESC")
    .limit(limit)
    .getMany();
  return foundArtwork;
};

export const fetchArtworkTags = async ({ tag, cursor, limit, connection }) => {
  const queryBuilder = await connection
    .getRepository(Tag)
    .createQueryBuilder("tag");
  const foundTags = await queryBuilder
    .where(`tag.title ILIKE :title`, {
      title: `${tag}%`,
    })
    .orderBy("tag.serial", "DESC")
    .limit(limit)
    .getMany();
  return foundTags;
};

export const fetchVersionDetails = async ({
  versionId,
  selection,
  connection,
}) => {
  const foundVersion = await connection
    .getRepository(Version)
    .createQueryBuilder("version")
    .leftJoinAndSelect("version.artwork", "artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("version.cover", "cover")
    .select([
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...ARTWORK_SELECTION["CURRENT_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("owner"),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...(selection ? selection : []),
    ])
    .where(
      "version.id = :versionId AND artwork.active = :active AND artwork.visibility = :visibility",
      {
        versionId,
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
      }
    )
    .getOne();
  return foundVersion;
};

export const fetchArtworkId = async ({ artworkId, connection }) => {
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")

    .select([...ARTWORK_SELECTION["STRIPPED_INFO"]()])
    .where(
      "artwork.id = :artworkId AND artwork.active = :active AND artwork.visibility = :visibility",
      {
        artworkId,
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
      }
    )
    .getOne();
  return foundArtwork?.id ?? null;
};

export const fetchArtworkDetails = async ({ artworkId, connection }) => {
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .leftJoinAndMapMany(
      "owner.reviews",
      Review,
      "review",
      "review.revieweeId = owner.id"
    )
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("version.media", "media")
    .leftJoinAndMapMany(
      "artwork.favorites",
      Favorite,
      "favorite",
      "favorite.artworkId = :artworkId",
      { artworkId }
    )
    .select([
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["ESSENTIAL_INFO"]("owner"),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...MEDIA_SELECTION["STRIPPED_INFO"](),
      ...FAVORITE_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      "artwork.id = :artworkId AND artwork.active = :active AND artwork.visibility = :visibility",
      {
        artworkId,
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
      }
    )
    .getOne();
  if (foundArtwork && foundArtwork.owner) {
    foundArtwork.owner.rating = calculateRating({
      active: foundArtwork.owner.active,
      reviews: foundArtwork.owner.reviews,
    });
    foundArtwork.favorites = foundArtwork.favorites.length;
  }
  return foundArtwork;
};

export const fetchArtworkEdit = async ({ userId, artworkId, connection }) => {
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .select([
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      "artwork.id = :artworkId AND artwork.ownerId = :userId AND artwork.active = :active",
      {
        artworkId,
        userId,
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
      }
    )
    .getOne();
  return foundArtwork;
};

export const fetchUserView = async ({
  userId,
  ipAddress,
  artworkId,
  connection,
}) => {
  const foundView = await connection
    .getRepository(View)
    .createQueryBuilder("view")
    .select([
      ...VIEW_SELECTION["ESSENTIAL_INFO"](),
      ...VIEW_SELECTION["OWNER_INFO"](),
    ])
    .where(
      userId
        ? "view.ownerId = :userId AND view.artworkId = :artworkId"
        : "view.ownerId IS NULL AND view.ip = :ipAddress AND view.artworkId = :artworkId",
      {
        userId,
        ipAddress,
        artworkId,
      }
    )
    .getOne();
  return foundView;
};

export const addNewView = async ({
  userId,
  artworkId,
  ipAddress,
  connection,
}) => {
  const createdView = await connection
    .createQueryBuilder()
    .insert()
    .into(View)
    .values({ ownerId: userId ?? null, ip: ipAddress, artworkId })
    .execute();
  return createdView;
};

export const fetchArtworkComments = async ({
  artworkId,
  cursor,
  limit,
  connection,
}) => {
  const queryBuilder = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment");
  const foundComments = await queryBuilder
    .leftJoinAndSelect("comment.artwork", "artwork")
    .leftJoinAndSelect("comment.owner", "owner")
    .leftJoinAndSelect("comment.likes", "like")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .select([
      ...COMMENT_SELECTION["ESSENTIAL_INFO"](),
      ...LIKE_SELECTION["ESSENTIAL_INFO"](),
      ...LIKE_SELECTION["OWNER_INFO"](),
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("owner"),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      `comment.artworkId = :artworkId AND artwork.active = :active AND artwork.visibility = :visibility AND comment.serial < 
      ${resolveSubQuery(
        queryBuilder,
        "comment",
        Comment,
        cursor,
        Number.MAX_VALUE
      )}`,
      {
        artworkId,
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
      }
    )
    .orderBy("comment.serial", "DESC")
    .limit(limit)
    .getMany();
  return foundComments;
};

export const fetchArtworkMedia = async ({ artworkId, userId, connection }) => {
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
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
      "artwork.id = :artworkId AND artwork.ownerId = :userId AND artwork.active = :active",
      {
        artworkId,
        userId,
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
      }
    )
    .getOne();
  return foundArtwork;
};

export const fetchFavoritesCount = async ({ artworkId, connection }) => {
  const foundFavorites = await connection
    .getRepository(Favorite)
    .createQueryBuilder("favorite")
    // $TODO should artwork.active and artwork.visible be checked as well?
    .select([...FAVORITE_SELECTION["STRIPPED_INFO"]()])
    .where("favorite.artworkId = :artworkId", {
      artworkId,
    })
    .getCount();
  return foundFavorites;
};

export const fetchFavoriteByParents = async ({
  userId,
  artworkId,
  connection,
}) => {
  const foundFavorite = await connection
    .getRepository(Favorite)
    .createQueryBuilder("favorite")
    .select([...FAVORITE_SELECTION["STRIPPED_INFO"]()])
    .where("favorite.ownerId = :userId AND favorite.artworkId = :artworkId", {
      userId,
      artworkId,
    })
    .getOne();
  return foundFavorite;
};

export const fetchLikeByParents = async ({ userId, commentId, connection }) => {
  const foundLike = await connection
    .getRepository(Like)
    .createQueryBuilder("like")
    .select([...LIKE_SELECTION["STRIPPED_INFO"]()])
    .where("like.ownerId = :userId AND like.commentId = :commentId", {
      userId,
      commentId,
    })
    .getOne();
  return foundLike;
};

export const addNewCover = async ({ coverId, artworkUpload, connection }) => {
  const savedCover = await connection
    .createQueryBuilder()
    .insert()
    .into(Cover)
    .values([
      {
        id: coverId,
        source: artworkUpload.fileCover,
        orientation: artworkUpload.fileOrientation,
        dominant: artworkUpload.fileDominant,
        height: upload.artwork.fileTransform.height(
          artworkUpload.fileHeight,
          artworkUpload.fileWidth
        ),
        width: upload.artwork.fileTransform.width,
      },
    ])
    .execute();
  return savedCover;
};

export const addNewMedia = async ({ mediaId, artworkUpload, connection }) => {
  const savedMedia = await connection
    .createQueryBuilder()
    .insert()
    .into(Media)
    .values([
      {
        id: mediaId,
        source: artworkUpload.fileMedia,
        dominant: artworkUpload.fileDominant,
        orientation: artworkUpload.fileOrientation,
        height: artworkUpload.fileHeight,
        width: artworkUpload.fileWidth,
      },
    ])
    .execute();
  return savedMedia;
};

export const addNewVersion = async ({
  versionId,
  coverId,
  mediaId,
  artworkId,
  prevArtwork,
  artworkData,
  connection,
}) => {
  const savedVersion = await connection
    .createQueryBuilder()
    .insert()
    .into(Version)
    .values([
      {
        id: versionId,
        title: artworkData.artworkTitle,
        availability: artworkData.artworkAvailability,
        type: artworkData.artworkType,
        license: artworkData.artworkLicense,
        use: artworkData.artworkUse,
        personal: artworkData.artworkPersonal,
        commercial: artworkData.artworkCommercial,
        description: artworkData.artworkDescription,
        tags: artworkUpload.artworkTags,
        coverId,
        mediaId,
        artworkId,
      },
    ])
    .execute();
  return savedVersion;
};

export const addNewArtwork = async ({
  artworkId,
  versionId,
  userId,
  artworkVisibility,
  connection,
}) => {
  const savedArtwork = await connection
    .createQueryBuilder()
    .insert()
    .into(Artwork)
    .values([
      {
        id: artworkId,
        ownerId: userId,
        currentId: versionId,
        active: true,
        visibility: artworkVisibility,
        generated: false,
      },
    ])
    .execute();
  return savedArtwork;
};

export const addNewFavorite = async ({
  favoriteId,
  userId,
  artworkId,
  connection,
}) => {
  const savedFavorite = await connection
    .createQueryBuilder()
    .insert()
    .into(Favorite)
    .values([
      {
        id: favoriteId,
        ownerId: userId,
        artworkId,
      },
    ])
    .execute();
  return savedFavorite;
};

export const removeExistingFavorite = async ({ favoriteId, connection }) => {
  const deletedFavorite = await connection
    .createQueryBuilder()
    .delete()
    .from(Favorite)
    .where("id = :favoriteId", { favoriteId })
    .execute();
  return deletedFavorite;
};

export const addNewLike = async ({ likeId, userId, commentId, connection }) => {
  const savedLike = await connection
    .createQueryBuilder()
    .insert()
    .into(Like)
    .values([
      {
        id: likeId,
        ownerId: userId,
        commentId,
      },
    ])
    .execute();
  return savedLike;
};

export const removeExistingLike = async ({ likeId, connection }) => {
  const deletedLike = await connection
    .createQueryBuilder()
    .delete()
    .from(Like)
    .where("id = :likeId", { likeId })
    .execute();
  return deletedLike;
};

export const removeArtworkVersion = async ({ versionId, connection }) => {
  const deletedVersion = await connection
    .createQueryBuilder()
    .delete()
    .from(Version)
    .where("id = :versionId", { versionId })
    .execute();
  return deletedVersion;
};

export const updateArtworkVersion = async ({
  artworkId,
  currentId,
  artworkVisibility,
  connection,
}) => {
  const updatedArtwork = await connection
    .createQueryBuilder()
    .update(Artwork)
    .set({ currentId, visibility: artworkVisibility })
    .where("id = :artworkId AND active = :active", {
      artworkId,
      active: ARTWORK_SELECTION["ACTIVE_STATUS"],
    })
    .execute();
  return updatedArtwork;
};

export const deactivateArtworkVersion = async ({ artworkId, connection }) => {
  const updatedArtwork = await connection
    .createQueryBuilder()
    .update(Artwork)
    .set({
      active: false,
      visibility: ARTWORK_SELECTION["INVISIBILITY_STATUS"],
      current: null,
    })
    .where("id = :artworkId AND active = :active", {
      artworkId,
      active: ARTWORK_SELECTION["ACTIVE_STATUS"],
    })
    .execute();
  return updatedArtwork;
};

export const deactivateExistingArtwork = async ({ artworkId, connection }) => {
  const updatedArtwork = await connection
    .createQueryBuilder()
    .update(Artwork)
    .set({
      active: false,
      visibility: ARTWORK_SELECTION["INVISIBILITY_STATUS"],
    })
    .where("id = :artworkId AND active = :active", {
      artworkId,
      active: ARTWORK_SELECTION["ACTIVE_STATUS"],
    })
    .execute();
  return updatedArtwork;
};

export const fetchAllUserArtwork = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
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
      `artwork.ownerId = :userId AND artwork.active = :active AND artwork.serial > 
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

// $Needs testing (mongo -> postgres)
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
    .loadRelationCountAndMap("artwork.favorites", "artwork.favorites")
    .loadRelationCountAndMap("artwork.comments", "artwork.comments")
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

export const fetchUserPurchasesWithMedia = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
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
    .orderBy("order.artworkId", "DESC")
    .addOrderBy("order.serial", "DESC")
    .getMany();
  const sortedPurchases = foundPurchases.sort((a, b) => a.created - b.created);
  const formattedPurchases = limit
    ? sortedPurchases.slice(0, limit)
    : sortedPurchases;
  return formattedPurchases;
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
    .loadRelationCountAndMap("artwork.favorites", "artwork.favorites")
    .loadRelationCountAndMap("artwork.comments", "artwork.comments")
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

export const fetchCommentByParent = async ({
  artworkId,
  commentId,
  connection,
}) => {
  const foundComment = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .leftJoinAndSelect("comment.artwork", "artwork")
    .leftJoinAndSelect("comment.owner", "owner")
    .leftJoinAndSelect("comment.likes", "like")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .select([
      ...COMMENT_SELECTION["ESSENTIAL_INFO"](),
      ...LIKE_SELECTION["ESSENTIAL_INFO"](),
      ...LIKE_SELECTION["OWNER_INFO"](),
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("owner"),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      "comment.id = :commentId AND comment.artworkId = :artworkId AND artwork.visibility = :visibility AND artwork.active = :active",
      {
        commentId,
        artworkId,
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
      }
    )
    .getOne();
  return foundComment;
};

export const fetchCommentByOwner = async ({
  userId,
  commentId,
  connection,
}) => {
  const foundComment = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .leftJoinAndSelect("comment.artwork", "artwork")
    .leftJoinAndSelect("comment.owner", "owner")
    .leftJoinAndSelect("comment.likes", "like")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .select([
      ...COMMENT_SELECTION["ESSENTIAL_INFO"](),
      ...LIKE_SELECTION["ESSENTIAL_INFO"](),
      ...LIKE_SELECTION["OWNER_INFO"](),
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("owner"),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      "comment.id = :commentId AND comment.ownerId = :userId AND artwork.visibility = :visibility AND artwork.active = :active",
      {
        commentId,
        userId,
        visibility: ARTWORK_SELECTION["VISIBILITY_STATUS"],
        active: ARTWORK_SELECTION["ACTIVE_STATUS"],
      }
    )
    .getOne();
  return foundComment;
};

export const addNewComment = async ({
  commentId,
  artworkId,
  userId,
  commentContent,
  connection,
}) => {
  const savedComment = await connection
    .createQueryBuilder()
    .insert()
    .into(Comment)
    .values([
      {
        id: commentId,
        artworkId,
        ownerId: userId,
        content: commentContent,
        modified: false,
        generated: false,
      },
    ])
    .returning("*")
    .execute();
  return savedComment;
};

export const editExistingComment = async ({
  commentId,
  userId,
  commentContent,
  connection,
}) => {
  const updatedComment = await connection
    .createQueryBuilder()
    .update(Comment)
    .set({ content: commentContent, modified: true })
    .where(
      // $TODO should artwork.active and artwork.visibility be checked as well?
      'id = :commentId AND "ownerId" = :userId',
      {
        commentId,
        userId,
      }
    )
    .execute();
  return updatedComment;
};

export const removeExistingComment = async ({
  commentId,
  userId,
  connection,
}) => {
  const deletedComment = await connection
    .createQueryBuilder()
    .delete()
    .from(Comment)
    .where('id = :commentId AND "ownerId" = :userId', {
      commentId,
      userId,
    })
    .execute();
  return deletedComment;
};

export const removeExistingLikes = async ({ commentId, connection }) => {
  const deletedLikes = await connection
    .createQueryBuilder()
    .delete()
    .from(Like)
    .where("commentId = :commentId", {
      commentId,
    })
    .execute();
  return deletedLikes;
};
