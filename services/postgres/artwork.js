import { getConnection } from "typeorm";
import { upload } from "../../common/constants";
import { Artwork } from "../../entities/Artwork";
import { Comment } from "../../entities/Comment";
import { Cover } from "../../entities/Cover";
import { Favorite } from "../../entities/Favorite";
import { Media } from "../../entities/Media";
import { Version } from "../../entities/Version";

const ARTWORK_ACTIVE_STATUS = true;

export const fetchArtworkById = async ({ artworkId }) => {
  /*   return await Artwork.findOne({
    where: [{ id: artworkId }, { active: true }],
    relations: ["owner"],
  }); */

  const foundArtwork = await getConnection()
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .where("artwork.id = :id AND artwork.active = :active", {
      id: artworkId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundArtwork);
  return foundArtwork;
};

// $Needs testing (mongo -> postgres)
export const fetchActiveArtworks = async ({ dataSkip, dataLimit }) => {
  // return await Artwork.find({
  //   where: [{ active: true }],
  //   relations: ["owner", "current"],
  //   skip: dataSkip,
  //   take: dataLimit,
  // });
  const foundArtwork = await getConnection()
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
export const fetchVersionDetails = async ({ versionId }) => {
  // return await Version.findOne({
  //   where: [{ id: versionId }],
  //   relations: ["artwork", "artwork.owner"],
  // });
  const foundVersion = await getConnection()
    .getRepository(Version)
    .createQueryBuilder("version")
    .leftJoinAndSelect("version.artwork", "artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .leftJoinAndSelect("version.cover", "cover")
    .where("version.id = :id", {
      id: versionId,
    })
    .getOne();
  console.log(foundVersion);
  return foundVersion;
};

export const fetchArtworkDetails = async ({
  artworkId,
  dataSkip,
  dataLimit,
}) => {
  // const foundArtwork = await Artwork.findOne({
  //   where: [{ id: artworkId, active: true }],
  //   relations: ["owner", "current"],
  // });
  // return foundArtwork;

  // $TODO find count of favorites
  const foundArtwork = await getConnection()
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
      "comment.artworkId = :id",
      { id: artworkId }
    )
    .leftJoinAndSelect("comment.owner", "commentOwner")
    .leftJoinAndSelect("commentOwner.avatar", "commentAvatar")
    .leftJoinAndMapMany(
      "artwork.favorites",
      Favorite,
      "favorite",
      "favorite.artworkId = :id",
      { id: artworkId }
    )
    .where("artwork.id = :id AND artwork.active = :active", {
      id: artworkId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundArtwork);
  return foundArtwork;
};

export const fetchArtworkComments = async ({
  artworkId,
  dataSkip,
  dataLimit,
}) => {
  // return await Comment.find({
  //   where: [{ artwork: artworkId }],
  //   relations: ["owner"],
  //   skip: dataSkip,
  //   take: dataLimit,
  // });
  const foundComments = await getConnection()
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .leftJoinAndSelect("comment.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .where("comment.artworkId = :id", {
      id: artworkId,
    })
    .getMany();
  console.log(foundComments);
  return foundComments;
};

export const fetchUserArtworks = async ({ userId, dataSkip, dataLimit }) => {
  // return await Artwork.find({
  //   where: [{ owner: userId, active: true }],
  //   relations: ["current"],
  //   skip: dataSkip,
  //   take: dataLimit,
  // });
  const foundArtwork = await getConnection()
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .where("artwork.ownerId = :id AND artwork.active = :active", {
      id: userId,
      active: ARTWORK_ACTIVE_STATUS,
    })
    .getMany();
  console.log(foundArtwork);
  return foundArtwork;
};

// $TODO isto kao i prethodni service samo bez skip i limit
// $Needs testing (mongo -> postgres)
export const fetchArtworksByOwner = async ({ userId }) => {
  return await Artwork.find({
    where: [{ owner: userId, active: true }],
    relations: ["current"],
  });
};

export const addNewCover = async ({ artworkUpload }) => {
  const newCover = new Cover();
  newCover.source = artworkUpload.fileCover;
  newCover.dominant = artworkUpload.fileDominant;
  newCover.orientation = artworkUpload.fileOrientation;
  newCover.height = upload.artwork.fileTransform.height(
    artworkUpload.fileHeight,
    artworkUpload.fileWidth
  );
  newCover.width = upload.artwork.fileTransform.width;
  return newCover;
};

export const addNewMedia = async ({ artworkUpload }) => {
  const newMedia = new Media();
  newMedia.source = artworkUpload.fileMedia;
  newMedia.dominant = artworkUpload.fileDominant;
  newMedia.orientation = artworkUpload.fileOrientation;
  newMedia.height = artworkUpload.fileHeight;
  newMedia.width = artworkUpload.fileWidth;
  return newMedia;
};

// $Needs testing (mongo -> postgres)
// probably not working as intended
export const addNewVersion = async ({
  prevArtwork,
  artworkData,
  artworkUpload,
  savedCover,
  savedMedia,
}) => {
  const newVersion = new Version();
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
  return newVersion;
};

// $Needs testing (mongo -> postgres)
// probably not working as intended
export const addNewArtwork = async ({ savedVersion, userId }) => {
  const newArtwork = new Artwork();
  newArtwork.owner = userId;
  newArtwork.current = savedVersion;
  newArtwork.active = true;
  newArtwork.generated = false;
  return newArtwork;
};

export const addNewFavorite = async ({ userId, artworkId }) => {
  const newFavorite = new Favorite();
  newFavorite.ownerId = userId;
  newFavorite.artworkId = artworkId;
  return await Favorite.save(newFavorite);
};

export const removeExistingFavorite = async ({ favoriteId }) => {
  const deletedFavorite = await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Favorite)
    .where("id = :id", { id: favoriteId })
    .execute();
  console.log(deletedFavorite);
  return deletedFavorite;
};

export const fetchFavoriteByParents = async ({ userId, artworkId }) => {
  // const foundFavorite = await Favorite.findOne({
  //   where: [{ ownerId: userId, artworkId }],
  // });
  // return foundFavorite;

  const foundFavorite = await getConnection()
    .getRepository(Favorite)
    .createQueryBuilder("favorite")
    .where("favorite.ownerId = :ownerId AND favorite.artworkId = :artworkId", {
      ownerId: userId,
      artworkId: artworkId,
    })
    .getOne();
  console.log(foundFavorite);
  return foundFavorite;
};

// $Needs testing (mongo -> postgres)
// check if cascade works correctly
export const removeArtworkVersion = async ({ versionId }) => {
  // const foundVersion = await Version.findOne({ id: versionId });
  // await Version.remove(foundVersion);
  const deletedVersion = await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Version)
    .where("id = :id", { id: versionId })
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
export const deactivateExistingArtwork = async ({ artworkId }) => {
  const foundArtwork = Artwork.findOne({
    where: [{ id: artworkId, active: true }],
  });
  foundArtwork.active = false;
  return await Artwork.save(foundArtwork);
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
