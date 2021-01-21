import crypto from "crypto";
import Artwork from "../../models/artwork.js";
import License from "../../models/license.js";
import Version from "../../models/version.js";

export const fetchArtworkById = async ({ artworkId, session = null }) => {
  return await Artwork.findOne({
    $and: [{ id: artworkId }, { active: true }],
  }).session(session);
};

export const fetchActiveArtworks = async ({
  cursor,
  limit,
  session = null,
}) => {
  return await Artwork.find({ active: true }, undefined, {
    skip: cursor,
    limit: limit,
  })
    .populate("owner")
    .populate(
      "current",
      "id cover created title personal type license availability description tags use commercial dominant orientation height width"
    );
};

export const fetchVersionDetails = async ({ versionId, session = null }) => {
  return await Version.findOne({ id: versionId }).deepPopulate("artwork.owner");
};

export const fetchArtworkDetails = async ({
  artworkId,
  cursor,
  limit,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ id: artworkId }, { active: true }],
  })
    .populate(
      cursor !== undefined && limit !== undefined
        ? {
            path: "comments",
            options: {
              skip: cursor,
              limit: limit,
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
      "id cover created title personal type license availability description tags use commercial dominant orientation height width"
    );
};

export const fetchArtworkComments = async ({
  artworkId,
  cursor,
  limit,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ id: artworkId }, { active: true }],
  })
    .populate({
      path: "comments",
      options: {
        skip: cursor,
        limit: limit,
      },
      populate: {
        path: "owner",
      },
    })
    .populate("owner")
    .populate(
      "current",
      "id cover created title personal type license availability description tags use commercial dominant orientation height width"
    );
};

export const fetchArtworkReviews = async ({
  artworkId,
  cursor,
  limit,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ id: artworkId }, { active: true }],
  })
    .populate({
      path: "reviews",
      options: {
        skip: cursor,
        limit: limit,
      },
      populate: {
        path: "owner",
      },
    })
    .populate("owner")
    .populate(
      "current",
      "id cover created title personal type license availability description tags use commercial dominant orientation height width"
    );
};

export const fetchUserArtworks = async ({
  userId,
  cursor,
  limit,
  session = null,
}) => {
  return await Artwork.find(
    {
      $and: [{ owner: userId }, { active: true }],
    },
    undefined,
    {
      skip: cursor,
      limit: limit,
    }
  ).populate(
    "current",
    "id cover created title personal type license availability description tags use commercial dominant orientation height width"
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
    $and: [{ id: artworkId }, { owner: userId }, { active: true }],
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
  newArtwork.current = savedVersion.id;
  newArtwork.favorites = 0;
  const savedArtwork = await newArtwork.save({ session });
  savedVersion.artwork = savedArtwork.id;
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
export const addArtworkFavorite = async ({ artworkId, session = null }) => {
  return await Artwork.updateOne(
    {
      $and: [{ id: artworkId }, { active: true }],
    },
    { $inc: { favorites: 1 } }
  ).session(session);
};

export const removeArtworkFavorite = async ({ artworkId, session = null }) => {
  return await Artwork.updateOne(
    {
      $and: [{ id: artworkId }, { active: true }],
    },
    { $inc: { favorites: -1 } }
  ).session(session);
};

export const removeArtworkVersion = async ({ versionId, session = null }) => {
  return await Version.remove({
    id: versionId,
  }).session(session);
};

export const addArtworkComment = async ({
  artworkId,
  commentId,
  session = null,
}) => {
  return await Artwork.findOneAndUpdate(
    {
      id: artworkId,
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
      id: artworkId,
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
  newLicense.artwork = artworkData.id;
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
  return await Artwork.updateOne({ id: artworkId }, { active: false }).session(
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
      $and: [{ id: artworkId }, { active: true }],
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
