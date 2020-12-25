import crypto from "crypto";
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

// needs transaction (done)
export const addNewArtwork = async ({ artworkData, artworkUpload, userId }) => {
  const newVersion = new Version();
  newVersion.cover = artworkUpload.fileCover || "";
  newVersion.media = artworkUpload.fileMedia || "";
  newVersion.dominant = artworkUpload.fileDominant || "";
  newVersion.orientation = artworkUpload.fileOrientation || "";
  newVersion.height = artworkUpload.fileHeight || "";
  newVersion.width = artworkUpload.fileWidth || "";
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
  const savedVersion = await newVersion.save({ session });
  const newArtwork = new Artwork();
  newArtwork.owner = userId;
  newArtwork.generated = false;
  newArtwork.active = true;
  newArtwork.comments = [];
  newArtwork.current = savedVersion._id;
  newArtwork.saves = 0;
  const savedArtwork = await newArtwork.save({ session });
  savedVersion.artwork = savedArtwork._id;
  return await savedVersion.save();
};

// needs transaction (done)
// needs testing
// $TODO Assign prev version values or empty values?
export const addNewVersion = async ({
  prevArtwork,
  artworkData,
  artworkUpload,
  session = null,
}) => {
  const newVersion = new Version();
  newVersion.cover = artworkUpload.fileCover || prevArtwork.cover;
  newVersion.media = artworkUpload.fileMedia || prevArtwork.media;
  newVersion.dominant = artworkUpload.fileDominant || prevArtwork.dominant;
  newVersion.orientation = artworkUpload.fileOrientation || "";
  newVersion.height = artworkUpload.fileHeight || prevArtwork.height;
  newVersion.width = artworkUpload.fileWidth || prevArtwork.width;
  newVersion.title = artworkData.artworkTitle || prevArtwork.artworkTitle;
  newVersion.type = artworkData.artworkType || prevArtwork.artworkType;
  newVersion.availability =
    artworkData.artworkAvailability || prevArtwork.artworkAvailability;
  newVersion.license = artworkData.artworkLicense || prevArtwork.artworkLicense;
  newVersion.use = artworkData.artworkUse || prevArtwork.artworkUse;
  newVersion.personal = artworkData.artworkPersonal;
  newVersion.commercial = artworkData.artworkCommercial;
  newVersion.category =
    artworkData.artworkCategory || prevArtwork.artworkCategory;
  newVersion.description =
    artworkData.artworkDescription || prevArtwork.artworkDescription;
  newVersion.tags = artworkData.artworkTags || prevArtwork.artworkTags;
  newVersion.artwork = prevArtwork.artwork;
  return await newVersion.save({ session });
};

// needs transaction (done)
export const addArtworkSave = async ({ artworkId, session = null }) => {
  return await Artwork.updateOne(
    {
      $and: [{ _id: artworkId }, { active: true }],
    },
    { $inc: { saves: 1 } }
  ).session(session);
};

export const removeArtworkSave = async ({ artworkId, session = null }) => {
  return await Artwork.updateOne(
    {
      $and: [{ _id: artworkId }, { active: true }],
    },
    { $inc: { saves: -1 } }
  ).session(session);
};

export const removeArtworkVersion = async ({ versionId, session = null }) => {
  return await Version.remove({
    _id: versionId,
  }).session(session);
};

export const addArtworkComment = async ({
  artworkId,
  commentId,
  session = null,
}) => {
  return await Artwork.findOneAndUpdate(
    {
      _id: artworkId,
    },
    { $push: { comments: commentId } },
    { new: true }
  ).session(session);
};

export const removeArtworkComment = async ({
  artworkId,
  commentId,
  session = null,
}) => {
  return await Artwork.findOneAndUpdate(
    {
      _id: artworkId,
    },
    { $pull: { comments: commentId } },
    { new: true }
  ).session(session);
};

// needs transaction (done)
export const addNewLicense = async ({
  userId,
  artworkData,
  licenseData,
  session = null,
}) => {
  const newLicense = new License();
  newLicense.owner = userId;
  newLicense.artwork = artworkData._id;
  newLicense.fingerprint = crypto.randomBytes(20).toString("hex");
  newLicense.assignee = licenseData.licenseAssignee;
  newLicense.company = licenseData.licenseCompany;
  newLicense.type = licenseData.licenseType;
  newLicense.active = false;
  newLicense.price = artworkData.current[licenseData.licenseType];
  return await newLicense.save({ session });
};

export const deactivateExistingArtwork = async ({
  artworkId,
  session = null,
}) => {
  return await Artwork.updateOne({ _id: artworkId }, { active: false }).session(
    session
  );
};

export const addArtworkReview = async ({
  artworkId,
  reviewId,
  session = null,
}) => {
  return await Artwork.updateOne(
    {
      $and: [{ _id: artworkId }, { active: true }],
    },
    { $push: { reviews: reviewId } }
  ).session(session);
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
