import { upload } from "../../common/constants";
import { Artwork } from "../../entities/Artwork";
import { Comment } from "../../entities/Comment";
import { Cover } from "../../entities/Cover";
import { Favorite } from "../../entities/Favorite";
import { Media } from "../../entities/Media";
import { Review } from "../../entities/Review";
import { Version } from "../../entities/Version";
import { calculateRating, resolveSubQuery } from "../../utils/helpers";
import {
  ARTWORK_SELECTION,
  AVATAR_SELECTION,
  COMMENT_SELECTION,
  COVER_SELECTION,
  FAVORITE_SELECTION,
  MEDIA_SELECTION,
  REVIEW_SELECTION,
  USER_SELECTION,
  VERSION_SELECTION,
} from "../../utils/selectors";

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

export const fetchArtworkDetails = async ({
  artworkId,
  cursor,
  limit,
  connection,
}) => {
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
    .leftJoinAndSelect("owner.avatar", "avatar")
    .select([
      ...COMMENT_SELECTION["ESSENTIAL_INFO"](),
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
        // $TODO restore after category implementation
        // category: artworkData.artworkCategory,
        description: artworkData.artworkDescription,
        // $TODO restore after tags implementation
        /* tags: artworkUpload.fileDominant, */
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
