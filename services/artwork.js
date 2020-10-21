import crypto from "crypto";
import Artwork from "../models/artwork.js";
import License from "../models/license.js";
import Version from "../models/version.js";

export const fetchArtworkById = async ({ artworkId, session = null }) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  }).session(session);
};

export const fetchActiveArtworks = async ({
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await Artwork.find({ active: true }, undefined, {
    skip: dataSkip,
    limit: dataLimit,
  })
    .populate("owner")
    .populate(
      "current",
      "_id cover created title personal type license availability description use commercial height width"
    );
};

export const fetchVersionDetails = async ({ versionId, session = null }) => {
  return await Version.findOne({ _id: versionId }).deepPopulate(
    "artwork.owner"
  );
};

export const fetchArtworkDetails = async ({
  artworkId,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  })
    .populate(
      dataSkip !== undefined && dataLimit !== undefined
        ? {
            path: "comments",
            options: {
              skip: dataSkip,
              limit: dataLimit,
            },
            populate: {
              path: "owner",
            },
          }
        : {
            path: "comments",
            populate: {
              path: "owner",
            },
          }
    )
    .populate("owner")
    .populate(
      "current",
      "_id cover created title personal type license availability description use commercial height width"
    );
};

export const fetchArtworkComments = async ({
  artworkId,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  })
    .populate({
      path: "comments",
      options: {
        skip: dataSkip,
        limit: dataLimit,
      },
      populate: {
        path: "owner",
      },
    })
    .populate("owner")
    .populate(
      "current",
      "_id cover created title personal type license availability description use commercial height width"
    );
};

export const fetchArtworkReviews = async ({
  artworkId,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  })
    .populate({
      path: "reviews",
      options: {
        skip: dataSkip,
        limit: dataLimit,
      },
      populate: {
        path: "owner",
      },
    })
    .populate("owner")
    .populate(
      "current",
      "_id cover created title personal type license availability description use commercial height width"
    );
};

export const fetchUserArtworks = async ({
  userId,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await Artwork.find(
    {
      $and: [{ owner: userId }, { active: true }],
    },
    undefined,
    {
      skip: dataSkip,
      limit: dataLimit,
    }
  ).populate(
    "current",
    "_id cover created title personal type license availability description use commercial height width"
  );
};

export const fetchArtworksByOwner = async ({ userId, session = null }) => {
  return await Artwork.find({
    $and: [{ owner: userId }, { active: true }],
  })
    .populate("current")
    .populate("versions");
};

export const fetchArtworkByOwner = async ({
  artworkId,
  userId,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { owner: userId }, { active: true }],
  })
    .populate("current")
    .populate("versions");
};

export const fetchArtworkLicenses = async ({
  artworkId,
  userId,
  session = null,
}) => {
  return await License.find({
    $and: [{ artwork: artworkId }, { owner: userId }, { active: false }],
  }).sort({ created: -1 });
};

// needs transaction (done)
export const addNewArtwork = async ({
  artworkData,
  artworkUpload,
  userId,
  session = null,
}) => {
  const newVersion = new Version();
  newVersion.cover = artworkUpload.fileCover || "";
  newVersion.media = artworkUpload.fileMedia || "";
  newVersion.dominant = artworkUpload.fileDominant || "";
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
  const savedVersion = await newVersion.save({ session });
  const newArtwork = new Artwork();
  newArtwork.owner = userId;
  newArtwork.active = true;
  newArtwork.comments = [];
  newArtwork.current = savedVersion._id;
  newArtwork.saves = 0;
  const savedArtwork = await newArtwork.save({ session });
  savedVersion.artwork = savedArtwork._id;
  return await savedVersion.save({ session });
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
