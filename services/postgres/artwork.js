import { upload } from "../../common/constants";
import { Artwork } from "../../entities/Artwork";
import { Cover } from "../../entities/Cover";
import { Favorite } from "../../entities/Favorite";
import { License } from "../../entities/License";
import { Media } from "../../entities/Media";
import { Version } from "../../entities/Version";

// $Needs testing (mongo -> postgres)
export const fetchArtworkById = async ({ artworkId }) => {
  return await Artwork.findOne({
    where: [{ id: artworkId }, { active: true }],
  });
};

// $Needs testing (mongo -> postgres)
export const fetchActiveArtworks = async ({ dataSkip, dataLimit }) => {
  return await Artwork.find({
    where: [{ active: true }],
    relations: ["owner", "current", "current.cover"],
    skip: dataSkip,
    take: dataLimit,
  });
};

// $Needs testing (mongo -> postgres)
export const fetchVersionDetails = async ({ versionId }) => {
  return await Version.findOne({
    where: [{ id: versionId }],
    relations: ["artwork", "artwork.owner", "cover"],
  });
};

// $TODO doesn't limit comments, but artwork?
export const fetchArtworkDetails = async ({
  artworkId,
  dataSkip,
  dataLimit,
}) => {
  const foundArtwork =
    dataSkip !== undefined && dataLimit !== undefined
      ? await Artwork.findOne({
          where: [{ id: artworkId, active: true }],
          relations: [
            "owner",
            "current",
            "current.cover",
            "comments",
            "comments.owner",
            "favorites",
          ],
          skip: dataSkip,
          take: dataLimit,
        })
      : await Artwork.findOne({
          where: [{ id: artworkId, active: true }],
          relations: [
            "owner",
            "current",
            "current.cover",
            "comments",
            "comments.owner",
            "favorites",
          ],
        });
  foundArtwork.favorites = foundArtwork.favorites.length;
  return foundArtwork;
};

// $TODO doesn't limit comments, but artwork?
export const fetchArtworkComments = async ({
  artworkId,
  dataSkip,
  dataLimit,
}) => {
  return await Artwork.findOne({
    where: [{ id: artworkId, active: true }],
    relations: ["comments", "comments.owner"],
    skip: dataSkip,
    take: dataLimit,
  });
};

// $TODO doesn't limit reviews, but artwork?
export const fetchUserArtworks = async ({ userId, dataSkip, dataLimit }) => {
  return await Artwork.find({
    where: [{ owner: userId, active: true }],
    relations: ["current", "current.cover"],
    skip: dataSkip,
    take: dataLimit,
  });
};

// $Needs testing (mongo -> postgres)
export const fetchArtworksByOwner = async ({ userId }) => {
  return await Artwork.find({
    where: [{ owner: userId, active: true }],
    relations: ["current", "current.cover"],
  });
};

// $Needs testing (mongo -> postgres)
export const fetchArtworkLicenses = async ({ artworkId, userId }) => {
  return await License.find({
    where: [{ artwork: artworkId, owner: userId, active: false }],
    order: {
      created: "DESC",
    },
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
  newFavorite.owner = userId;
  newFavorite.artwork = artworkId;
  return newFavorite;
};

// $Needs testing (mongo -> postgres)
// check if cascade works correctly
export const addArtworkFavorite = async ({ artworkId, savedFavorite }) => {
  const foundArtwork = await Artwork.findOne({
    where: [{ id: artworkId, active: true }],
    relations: ["favorites"],
  });
  foundArtwork.favorites.push(savedFavorite);
  return await Artwork.save(foundArtwork);
};

export const fetchFavoriteByParents = async ({ userId, artworkId }) => {
  const foundFavorite = await Favorite.findOne({
    where: [{ owner: userId, artwork: artworkId }],
  });
  return foundFavorite;
};

// $Needs testing (mongo -> postgres)
// check if cascade works correctly
export const removeArtworkFavorite = async ({ artworkId }) => {
  const foundFavorite = await Favorite.findOne({ artwork: artworkId });
  await Favorite.remove(foundFavorite);
};

// $Needs testing (mongo -> postgres)
// check if cascade works correctly
export const removeArtworkVersion = async ({ versionId }) => {
  const foundVersion = await Version.findOne({ id: versionId });
  await Version.remove(foundVersion);
};

export const addArtworkComment = async ({ artworkId, savedComment }) => {
  const foundArtwork = await Artwork.findOne({
    where: [{ id: artworkId, active: true }],
    relations: ["comments"],
  });
  foundArtwork.comments.push(savedComment);
  return await Artwork.save(foundArtwork);
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
