import { Cover } from "entities/Cover";
import { Favorite } from "entities/Favorite";
import { Media } from "entities/Media";
import { Artwork } from "../../entities/Artwork";
import { License } from "../../entities/License";
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
    relations: ["owner", "current"],
    skip: dataSkip,
    take: dataLimit,
  });
};

// $Needs testing (mongo -> postgres)
export const fetchVersionDetails = async ({ versionId }) => {
  return await Version.findOne({
    where: [{ id: versionId }],
    relations: ["artwork", "artwork.owner"],
  });
};

// $TODO doesn't limit comments, but artwork?
export const fetchArtworkDetails = async ({
  artworkId,
  dataSkip,
  dataLimit,
}) => {
  return dataSkip !== undefined && dataLimit !== undefined
    ? await Artwork.findOne({
        where: [{ id: artworkId, active: true }],
        relations: ["comments", "comments.owner"],
        skip: dataSkip,
        take: dataLimit,
      })
    : await Artwork.findOne({
        where: [{ id: artworkId, active: true }],
        relations: ["owner", "current", "comments", "comments.owner"],
      });
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
export const fetchArtworkReviews = async ({
  artworkId,
  dataSkip,
  dataLimit,
}) => {
  return await Artwork.findOne({
    where: [{ id: artworkId, active: true }],
    relations: ["reviews", "reviews.owner", "owner", "current"],
    skip: dataSkip,
    take: dataLimit,
  });
};

// $TODO doesn't limit reviews, but artwork?
export const fetchUserArtworks = async ({ userId, dataSkip, dataLimit }) => {
  return await Artwork.find({
    where: [{ owner: userId, active: true }],
    relations: ["current"],
    skip: dataSkip,
    take: dataLimit,
  });
};

// $Needs testing (mongo -> postgres)
export const fetchArtworksByOwner = async ({ userId }) => {
  return await Artwork.find({
    where: [{ owner: userId, active: true }],
    relations: ["current", "versions"],
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

// $Needs testing (mongo -> postgres)
// probably not working as intended
export const addNewArtwork = async ({ artworkData, artworkUpload, userId }) => {
  const newCover = new Cover();
  newMedia.source = artworkUpload.fileCover;
  newMedia.dominant = artworkUpload.fileDominant;
  newMedia.orientation = artworkUpload.fileOrientation;
  newMedia.height = null; // $TODO replace with cover height
  newMedia.width = null; // $TODO replace with cover width
  const newMedia = new Media();
  newMedia.source = artworkUpload.fileMedia;
  newMedia.dominant = artworkUpload.fileDominant;
  newMedia.orientation = artworkUpload.fileOrientation;
  newMedia.height = artworkUpload.fileHeight;
  newMedia.width = artworkUpload.fileWidth;
  const newVersion = new Version();
  newVersion.cover = newCover;
  newVersion.media = newMedia;
  newVersion.title = artworkData.artworkTitle || "";
  newVersion.type = artworkData.artworkType || "";
  newVersion.availability = artworkData.artworkAvailability || "";
  newVersion.license = artworkData.artworkLicense || "";
  newVersion.use = artworkData.artworkUse || "";
  newVersion.personal = artworkData.artworkPersonal;
  newVersion.commercial = artworkData.artworkCommercial;
  newVersion.category = artworkData.artworkCategory || "";
  newVersion.description = artworkData.artworkDescription || "";
  newVersion.tags = artworkData.artworkTags || [];
  const newArtwork = new Artwork();
  newArtwork.owner = userId;
  newArtwork.current = newVersion;
  newArtwork.active = true;
  newArtwork.generated = false;
  return await newArtwork.save();
};

// $Needs testing (mongo -> postgres)
// probably not working as intended
export const addNewVersion = async ({
  prevArtwork,
  artworkData,
  artworkUpload,
}) => {
  const newCover = new Cover();
  newMedia.source = artworkUpload.fileCover;
  newMedia.dominant = artworkUpload.fileDominant;
  newMedia.orientation = artworkUpload.fileOrientation;
  newMedia.height = null; // $TODO replace with cover height
  newMedia.width = null; // $TODO replace with cover width
  const newMedia = new Media();
  newMedia.source = artworkUpload.fileMedia;
  newMedia.dominant = artworkUpload.fileDominant;
  newMedia.orientation = artworkUpload.fileOrientation;
  newMedia.height = artworkUpload.fileHeight;
  newMedia.width = artworkUpload.fileWidth;
  const newVersion = new Version();
  newVersion.cover = newCover;
  newVersion.media = newMedia;
  newVersion.title = artworkData.artworkTitle;
  newVersion.type = artworkData.artworkType;
  newVersion.availability = artworkData.artworkAvailability;
  newVersion.license = artworkData.artworkLicense;
  newVersion.use = artworkData.artworkUse;
  newVersion.personal;
  newVersion.commercial;
  newVersion.category = artworkData.artworkCategory;
  newVersion.description = artworkData.artworkDescription;
  newVersion.tags = artworkData.artworkTags;
  newVersion.artwork = prevArtwork.artwork;
  return await newVersion.save();
};

// $Needs testing (mongo -> postgres)
// check if cascade works correctly
export const addArtworkSave = async ({ artworkId }) => {
  const newFavorite = new Favorite();
  newFavorite.owner = null; // $TODO add owner;
  newFavorite.artwork = artworkId;
  const foundArtwork = await Artwork.findOne({ where: [{ id: artworkId }] });
  foundArtwork.favorites.push(newFavorite);
  return await Artwork.save({ foundArtwork });
};

// $Needs testing (mongo -> postgres)
// check if cascade works correctly
export const removeArtworkSave = async ({ artworkId }) => {
  const foundFavorite = await Favorite.findOne({ artwork: artworkId });
  await Favorite.remove({ foundFavorite });
};

// $Needs testing (mongo -> postgres)
// check if cascade works correctly
export const removeArtworkVersion = async ({ versionId }) => {
  const foundVersion = await Version.findOne({ id: versionId });
  await Version.remove({ foundVersion });
};

// $TODO not needed anymore
// export const addArtworkComment = async ({ artworkId, commentId }) => {
//   return await Artwork.findOneAndUpdate(
//     {
//       _id: artworkId,
//     },
//     { $push: { comments: commentId } },
//     { new: true }
//   );
// };

// $TODO not needed anymore
// export const removeArtworkComment = async ({ artworkId, commentId }) => {
//   return await Artwork.findOneAndUpdate(
//     {
//       _id: artworkId,
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
  return await Artwork.save({ foundArtwork });
};

// $TODO not needed anymore
// export const addArtworkReview = async ({ artworkId, reviewId }) => {
//   return await Artwork.updateOne(
//     {
//       $and: [{ _id: artworkId }, { active: true }],
//     },
//     { $push: { reviews: reviewId } }
//   );
// };

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
//           license._id.equals(licenseId)
//         );
//         if (targetLicense) {
//           await User.updateOne(
//             {
//               _id: res.locals.user.id,
//               cart: { $elemMatch: { artwork: targetLicense.artwork } },
//             },
//             {
//               $pull: {
//                 'cart.$.licenses': targetLicense._id,
//               },
//             }
//           ).session(session);
//           await License.remove({
//             $and: [
//               { _id: targetLicense._id },
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
