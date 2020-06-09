import mongoose from 'mongoose';
import aws from 'aws-sdk';
import User from '../models/user.js';
import Artwork from '../models/artwork.js';
import Version from '../models/version.js';
import License from '../models/license.js';
import Comment from '../models/comment.js';
import Order from '../models/order.js';
import crypto from 'crypto';
import createError from 'http-errors';
import currency from 'currency.js';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET);

export const fetchArtworkById = async ({ artworkId, session = null }) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  }).session(session);
};

export const fetchActiveArtworks = async ({ skip, limit, session = null }) => {
  return await Artwork.find({ active: true }, undefined, {
    skip,
    limit,
  })
    .populate('owner')
    .populate(
      'current',
      '_id cover created title personal type license availability description use commercial'
    );
};

export const fetchArtworkDetails = async ({
  artworkId,
  skip,
  limit,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  })
    .populate(
      skip && limit
        ? {
            path: 'comments',
            options: {
              limit,
              skip,
            },
            populate: {
              path: 'owner',
            },
          }
        : {
            path: 'comments',
            populate: {
              path: 'owner',
            },
          }
    )
    .populate('owner')
    .populate(
      'current',
      '_id cover created title personal type license availability description use commercial'
    );
};

export const fetchArtworkComments = async ({
  artworkId,
  skip,
  limit,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  })
    .populate({
      path: 'comments',
      options: {
        limit,
        skip,
      },
      populate: {
        path: 'owner',
      },
    })
    .populate('owner')
    .populate(
      'current',
      '_id cover created title personal type license availability description use commercial'
    );
};

export const fetchArtworkReviews = async ({
  artworkId,
  skip,
  limit,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  })
    .populate({
      path: 'reviews',
      options: {
        limit,
        skip,
      },
      populate: {
        path: 'owner',
      },
    })
    .populate('owner')
    .populate(
      'current',
      '_id cover created title personal type license availability description use commercial'
    );
};

export const fetchUserArtworks = async ({
  userId,
  skip,
  limit,
  session = null,
}) => {
  return await Artwork.find(
    {
      $and: [{ owner: userId }, { active: true }],
    },
    undefined,
    {
      skip,
      limit,
    }
  ).populate(
    'current',
    '_id cover created title personal type license availability description use commercial'
  );
};

export const fetchUserArtwork = async ({
  artworkId,
  userId,
  session = null,
}) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { owner: userId }, { active: true }],
  })
    .populate('current')
    .populate('versions');
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
export const createNewArtwork = async ({
  artworkData,
  userId,
  session = null,
}) => {
  const newVersion = new Version();
  newVersion.cover = artworkData.artworkCover || '';
  newVersion.media = artworkData.artworkMedia || '';
  newVersion.title = artworkData.artworkTitle || '';
  newVersion.type = artworkData.artworkType || '';
  newVersion.availability = artworkData.artworkAvailability || '';
  newVersion.license = artworkData.artworkLicense || '';
  newVersion.use = artworkData.artworkUse || '';
  newVersion.personal = currency(artworkData.artworkPersonal).intValue || 0;
  newVersion.commercial =
    currency(artworkData.artworkCommercial).add(artworkData.artworkPersonal)
      .intValue || currency(artworkData.artworkPersonal).intValue;
  newVersion.category = artworkData.artworkCategory || '';
  newVersion.description = artworkData.artworkDescription || '';
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
export const updateExistingArtwork = async ({
  artworkData,
  session = null,
}) => {
  const newVersion = new Version();
  newVersion.cover = artworkData.artworkCover || '';
  newVersion.media = artworkData.artworkMedia || '';
  newVersion.title = artworkData.artworkTitle || '';
  newVersion.type = artworkData.artworkType || '';
  newVersion.availability = artworkData.artworkAvailability || '';
  newVersion.license = artworkData.artworkLicense || '';
  newVersion.use = artworkData.artworkUse || '';
  newVersion.personal = currency(artworkData.artworkPersonal).intValue || 0;
  newVersion.commercial =
    currency(artworkData.artworkCommercial).add(artworkData.artworkPersonal)
      .intValue || currency(artworkData.artworkPersonal).intValue;
  newVersion.category = artworkData.artworkCategory || '';
  newVersion.description = artworkData.artworkDescription || '';
  return await newVersion.save({ session });
};

// needs transaction (done)
// delete all comments (not done)
const deleteArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId } = req.params;
    const foundArtwork = await Artwork.findOne({
      $and: [
        { _id: artworkId },
        { owner: res.locals.user.id },
        { active: true },
      ],
    })
      .populate('current')
      .populate('versions')
      .session(session);
    if (foundArtwork) {
      const foundOrder = await Order.find({
        details: { $elemMatch: { artwork: foundArtwork._id } },
        details: { $elemMatch: { version: foundArtwork.current._id } },
      })
        .deepPopulate('details.artwork details.version')
        .session(session);
      console.log('order', foundOrder);
      if (foundOrder.length) {
        await Artwork.updateOne(
          {
            _id: artworkId,
          },
          {
            active: false,
          }
        ).session(session);
        await session.commitTransaction();
        return res.status(200).json('/my_artwork');
      } else {
        console.log('length', foundArtwork.versions.length);
        if (foundArtwork.versions.length) {
          let usedContent = false;
          foundArtwork.versions.map(function (version) {
            if (
              version.media == foundArtwork.current.media &&
              version.cover == foundArtwork.current.cover
            ) {
              usedContent = true;
            }
          });
          console.log('used content', usedContent);
          if (usedContent) {
            await Version.remove({
              _id: foundArtwork.current._id,
            }).session(session);
            await Artwork.updateOne(
              {
                _id: artworkId,
              },
              {
                current: null,
                active: false,
              }
            ).session(session);
            await session.commitTransaction();
            return res.status(200).json('/my_artwork');
          } else {
            const coverFolderName = 'artworkCovers/';
            const coverFileName = foundArtwork.current.cover
              .split('/')
              .slice(-1)[0];
            const coverFilePath = coverFolderName + coverFileName;
            const coverS3 = new aws.S3();
            const coverParams = {
              Bucket: 'vesper-testing',
              Key: coverFilePath,
            };

            await coverS3.deleteObject(coverParams).promise();

            const mediaFolderName = 'artworkMedia/';
            const mediaFileName = foundArtwork.current.media
              .split('/')
              .slice(-1)[0];
            const mediaFilePath = mediaFolderName + mediaFileName;
            const mediaS3 = new aws.S3();
            const mediaParams = {
              Bucket: 'vesper-testing',
              Key: mediaFilePath,
            };

            await mediaS3.deleteObject(mediaParams).promise();

            await Version.remove({
              _id: foundArtwork.current._id,
            }).session(session);
            await Artwork.updateOne(
              {
                _id: artworkId,
              },
              {
                current: null,
                active: false,
              }
            ).session(session);
            await session.commitTransaction();
            return res.status(200).json('/my_artwork');
          }
        } else {
          const coverFolderName = 'artworkCovers/';
          const coverFileName = foundArtwork.current.cover
            .split('/')
            .slice(-1)[0];
          const coverFilePath = coverFolderName + coverFileName;
          const coverS3 = new aws.S3();
          const coverParams = {
            Bucket: 'vesper-testing',
            Key: coverFilePath,
          };

          await coverS3.deleteObject(coverParams).promise();

          const mediaFolderName = 'artworkMedia/';
          const mediaFileName = foundArtwork.current.media
            .split('/')
            .slice(-1)[0];
          const mediaFilePath = mediaFolderName + mediaFileName;
          const mediaS3 = new aws.S3();
          const mediaParams = {
            Bucket: 'vesper-testing',
            Key: mediaFilePath,
          };

          await mediaS3.deleteObject(mediaParams).promise();

          await Version.remove({
            _id: foundArtwork.current._id,
          }).session(session);
          await Artwork.remove({
            _id: artworkId,
          }).session(session);
          await session.commitTransaction();
          return res.status(200).json('/my_artwork');
        }
      }
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
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

export const deleteArtworkComment = async ({
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
export const saveLicenseSet = async ({
  userId,
  artworkData,
  licensesData,
  session = null,
}) => {
  const licenseSet = licensesData.map((license) => {
    const newLicense = new License();
    newLicense.owner = userId;
    newLicense.artwork = artworkData._id;
    newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
    newLicense.type = license.licenseType;
    newLicense.active = false;
    newLicense.price =
      license.licenseType == 'commercial'
        ? artworkData.current.commercial
        : artworkData.current.personal;
    return newLicense;
  });
  return await License.insertMany(licenseSet, { session });
};

export const deactivateExistingArtwork = async ({
  artworkId,
  session = null,
}) => {
  return await Artwork.updateOne({ _id: artworkId }, { active: false }).session(
    session
  );
};

export const createArtworkReview = async ({
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
//           res.status(200).json({ message: 'License deleted' });
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
