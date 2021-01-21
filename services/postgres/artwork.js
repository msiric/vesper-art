import { upload } from "../../common/constants";
import { Artwork } from "../../entities/Artwork";
import { Comment } from "../../entities/Comment";
import { Cover } from "../../entities/Cover";
import { Favorite } from "../../entities/Favorite";
import { Media } from "../../entities/Media";
import { Version } from "../../entities/Version";

const ARTWORK_ACTIVE_STATUS = true;

// Only used when inserting comment
export const fetchArtworkById = async ({ artworkId, connection }) => {
  /*   return await Artwork.findOne({
    where: [{ id: artworkId }, { active: true }],
    relations: ["owner"],
  }); */

  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .where("artwork.id = :artworkId AND artwork.active = :active", {
      artworkId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundArtwork);
  return foundArtwork;
};

// $Needs testing (mongo -> postgres)
export const fetchActiveArtworks = async ({ cursor, limit, connection }) => {
  // return await Artwork.find({
  //   where: [{ active: true }],
  //   relations: ["owner", "current"],
  //   skip: cursor,
  //   take: limit,
  // });
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .where("artwork.active = :active", {
      active: ARTWORK_ACTIVE_STATUS,
    })
    .getMany();
  console.log(foundArtwork);
  return foundArtwork;
};

// $Needs testing (mongo -> postgres)
export const fetchVersionDetails = async ({ versionId, connection }) => {
  // return await Version.findOne({
  //   where: [{ id: versionId }],
  //   relations: ["artwork", "artwork.owner"],
  // });
  const foundVersion = await connection
    .getRepository(Version)
    .createQueryBuilder("version")
    .leftJoinAndSelect("version.artwork", "artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("artwork.current", "current")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .leftJoinAndSelect("version.cover", "cover")
    .where("version.id = :versionId", {
      versionId,
    })
    .getOne();
  console.log(foundVersion);
  return foundVersion;
};

export const fetchArtworkDetails = async ({
  artworkId,
  cursor,
  limit,
  connection,
}) => {
  // const foundArtwork = await Artwork.findOne({
  //   where: [{ id: artworkId, active: true }],
  //   relations: ["owner", "current"],
  // });
  // return foundArtwork;

  // $TODO find count of favorites
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndMapMany(
      "artwork.comments",
      Comment,
      "comment",
      "comment.artworkId = :artworkId",
      { artworkId }
    )
    .leftJoinAndSelect("comment.owner", "commentOwner")
    .leftJoinAndSelect("commentOwner.avatar", "commentAvatar")
    .leftJoinAndMapMany(
      "artwork.favorites",
      Favorite,
      "favorite",
      "favorite.artworkId = :artworkId",
      { artworkId }
    )
    .where("artwork.id = :artworkId AND artwork.active = :active", {
      artworkId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundArtwork);
  return foundArtwork;
};

export const fetchArtworkComments = async ({
  artworkId,
  cursor,
  limit,
  connection,
}) => {
  console.log("id", artworkId, "skip", cursor, "limit", limit);
  // return await Comment.find({
  //   where: [{ artwork: artworkId }],
  //   relations: ["owner"],
  //   skip: cursor,
  //   take: limit,
  // });
  const qb = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment");

  const foundComments = await qb
    .leftJoinAndSelect("comment.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .where(
      `comment.artworkId = :artworkId AND comment.serial > 
        ${
          cursor !== "null"
            ? qb
                .subQuery()
                .select("comment.serial")
                .from(Comment, "comment")
                .where("comment.id = :commentId", { commentId: cursor })
                .getQuery()
            : -1
        }`,
      {
        artworkId,
      }
    )
    .orderBy("comment.serial", "ASC")
    .limit(limit)
    .getMany();
  console.log(foundComments);
  return foundComments;
};

export const fetchUserArtworks = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  // return await Artwork.find({
  //   where: [{ owner: userId, active: true }],
  //   relations: ["current"],
  //   skip: cursor,
  //   take: limit,
  // });
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .where("artwork.ownerId = :userId AND artwork.active = :active", {
      userId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .getMany();
  console.log(foundArtwork);
  return foundArtwork;
};

// $TODO isto kao i prethodni service samo bez skip i limit
// $Needs testing (mongo -> postgres)
export const fetchArtworkByOwner = async ({ userId, connection }) => {
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .where("artwork.ownerId = :userId AND artwork.active = :active", {
      userId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundArtwork);
  return foundArtwork;
};

export const addNewCover = async ({ coverId, artworkUpload, connection }) => {
  /*   const newCover = new Cover();
  newCover.source = artworkUpload.fileCover;
  newCover.dominant = artworkUpload.fileDominant;
  newCover.orientation = artworkUpload.fileOrientation;
  newCover.height = upload.artwork.fileTransform.height(
    artworkUpload.fileHeight,
    artworkUpload.fileWidth
  );
  newCover.width = upload.artwork.fileTransform.width;
  return newCover; */

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
  console.log(savedCover);
  return savedCover;
};

export const addNewMedia = async ({ mediaId, artworkUpload, connection }) => {
  /*   const newMedia = new Media();
  newMedia.source = artworkUpload.fileMedia;
  newMedia.dominant = artworkUpload.fileDominant;
  newMedia.orientation = artworkUpload.fileOrientation;
  newMedia.height = artworkUpload.fileHeight;
  newMedia.width = artworkUpload.fileWidth;
  return newMedia; */

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
  console.log(savedMedia);
  return savedMedia;
};

// $Needs testing (mongo -> postgres)
// probably not working as intended
export const addNewVersion = async ({
  versionId,
  coverId,
  mediaId,
  artworkId,
  prevArtwork,
  artworkData,
  artworkUpload,
  connection,
}) => {
  /*   const newVersion = new Version();
  newVersion.cover = savedCover;
  newVersion.media = savedMedia;
  newVersion.title = artworkData.artworkTitle;
  newVersion.type = artworkData.artworkType;
  newVersion.availability = artworkData.artworkAvailability;
  newVersion.license = artworkData.artworkLicense;
  newVersion.use = artworkData.artworkUse;
  newVersion.personal = artworkData.artworkPersonal || 0; // $TODO uvijek mora bit integer;
  newVersion.commercial = artworkData.artworkCommercial;
  newVersion.category = artworkData.artworkCategory || "$TODO remove this";
  newVersion.description = artworkData.artworkDescription;
  // $TODO restore after tags implementation
  // newVersion.tags = artworkData.artworkTags;
  if (prevArtwork.artwork) newVersion.artwork = prevArtwork.artwork;
  return newVersion; */

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
        category: artworkData.artworkCategory,
        description: artworkData.artworkDescription,
        // $TODO restore after tags implementation
        /* tags: artworkUpload.fileDominant, */
        coverId,
        mediaId,
        artworkId,
      },
    ])
    .execute();
  console.log(savedVersion);
  return savedVersion;
};

// $Needs testing (mongo -> postgres)
// probably not working as intended
export const addNewArtwork = async ({
  artworkId,
  versionId,
  userId,
  connection,
}) => {
  /*   const newArtwork = new Artwork();
  newArtwork.owner = userId;
  newArtwork.current = savedVersion.id;
  newArtwork.active = true;
  newArtwork.generated = false;
  return newArtwork; */

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
        generated: false,
      },
    ])
    .execute();
  console.log(savedArtwork);
  return savedArtwork;
};

export const addNewFavorite = async ({
  favoriteId,
  userId,
  artworkId,
  connection,
}) => {
  /*   const newFavorite = new Favorite();
  newFavorite.ownerId = userId;
  newFavorite.artworkId = artworkId;
  return await Favorite.save(newFavorite); */

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
  console.log(savedFavorite);
  return savedFavorite;
};

export const removeExistingFavorite = async ({ favoriteId, connection }) => {
  const deletedFavorite = await connection
    .createQueryBuilder()
    .delete()
    .from(Favorite)
    .where("id = :favoriteId", { favoriteId })
    .execute();
  console.log(deletedFavorite);
  return deletedFavorite;
};

export const fetchFavoritesCount = async ({ artworkId, connection }) => {
  const foundFavorites = await connection
    .getRepository(Favorite)
    .createQueryBuilder("favorite")
    .where("favorite.artworkId = :artworkId", {
      artworkId,
    })
    .getCount();
  console.log(foundFavorites);
  return foundFavorites;
};

export const fetchFavoriteByParents = async ({
  userId,
  artworkId,
  connection,
}) => {
  // const foundFavorite = await Favorite.findOne({
  //   where: [{ ownerId: userId, artworkId }],
  // });
  // return foundFavorite;

  const foundFavorite = await connection
    .getRepository(Favorite)
    .createQueryBuilder("favorite")
    .where("favorite.ownerId = :userId AND favorite.artworkId = :artworkId", {
      userId,
      artworkId,
    })
    .getOne();
  console.log(foundFavorite);
  return foundFavorite;
};

// $Needs testing (mongo -> postgres)
// check if cascade works correctly
export const removeArtworkVersion = async ({ versionId, connection }) => {
  // const foundVersion = await Version.findOne({ id: versionId });
  // await Version.remove(foundVersion);
  const deletedVersion = await connection
    .createQueryBuilder()
    .delete()
    .from(Version)
    .where("id = :versionId", { versionId })
    .execute();
  console.log(deletedVersion);
  return deletedVersion;
};

// $TODO not needed anymore
// export const removeArtworkComment = async ({ artworkId, commentId }) => {
//   return await Artwork.findOneAndUpdate(
//     {
//       id: artworkId,
//     },
//     { $pull: { comments: commentId } },
//     { new: true }
//   );
// };

// $Needs testing (mongo -> postgres)
export const deactivateExistingArtwork = async ({ artworkId, connection }) => {
  /*   const foundArtwork = Artwork.findOne({
    where: [{ id: artworkId, active: true }],
  });
  foundArtwork.active = false;
  return await Artwork.save(foundArtwork); */

  const updatedArtwork = await connection
    .createQueryBuilder()
    .update(Artwork)
    .set({ active: false })
    .where("id = :artworkId AND active = :active", {
      artworkId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .execute();
  console.log(updatedArtwork);
  return updatedArtwork;
};

// needs transaction (done)
// const deleteLicense = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { artworkId, licenseId } = req.params;
//     const foundLicense = await License.find({
//       $and: [
//         { artwork: artworkId },
//         { owner: res.locals.user.id },
//         { active: false },
//       ],
//     }).session(session);
//     if (foundLicense) {
//       if (foundLicense.length > 1) {
//         const targetLicense = foundLicense.find((license) =>
//           license.id.equals(licenseId)
//         );
//         if (targetLicense) {
//           await User.updateOne(
//             {
//               id: res.locals.user.id,
//               cart: { $elemMatch: { artwork: targetLicense.artwork } },
//             },
//             {
//               $pull: {
//                 'cart.$.licenses': targetLicense.id,
//               },
//             }
//           ).session(session);
//           await License.remove({
//             $and: [
//               { id: targetLicense.id },
//               { owner: res.locals.user.id },
//               { active: false },
//             ],
//           }).session(session);
//           await session.commitTransaction();
//           res.json({ message: 'License deleted' });
//         } else {
//           throw createError(400, 'License not found');
//         }
//       } else {
//         throw createError(
//           400,
//           'At least one license needs to be associated with an artwork in cart'
//         );
//       }
//     } else {
//       throw createError(400, 'License not found');
//     }
//   } catch (err) {
//     await session.abortTransaction();
//     console.log(err);
//     next(err, res);
//   } finally {
//     session.endSession();
//   }
// };
