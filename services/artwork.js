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
import { sanitize } from '../utils/helpers.js';
import currency from 'currency.js';
import postArtworkValidator from '../utils/validation/postArtworkValidator.js';
import putArtworkValidator from '../utils/validation/putArtworkValidator.js';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET);

export const getActiveArtwork = async (skip, limit) => {
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

export const getDetails = async (artworkId, skip, limit) => {
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

export const getComments = async (artworkId, skip, limit) => {
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

export const getReviews = async (artworkId, skip, limit) => {
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

export const getGallery = async (artworkId, skip, limit) => {
  return await Artwork.find(
    {
      $and: [{ owner: res.locals.user.id }, { active: true }],
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

export const editArtwork = async (artworkId) => {
  return await Artwork.findOne({
    $and: [{ _id: artworkId }, { owner: res.locals.user.id }, { active: true }],
  }).populate('current');
};

export const getLicenses = async (artworkId) => {
  return await License.find({
    $and: [
      { artwork: artworkId },
      { owner: res.locals.user.id },
      { active: false },
    ],
  }).sort({ created: -1 });
};

// needs transaction (done)
const postNewArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error, value } = postArtworkValidator(sanitize(req.body));
    if (error) throw createError(400, error);
    if (value.artworkPersonal || value.artworkCommercial) {
      const foundUser = await User.findOne({
        $and: [{ _id: res.locals.user.id }, { active: true }],
      });
      if (!foundUser) throw createError(400, 'User not found');
      if (!foundUser.stripeId)
        throw createError(
          400,
          'Please complete the Stripe onboarding process before making your artwork commercially available'
        );
      const foundAccount = await stripe.accounts.retrieve(foundUser.stripeId);
      if (
        (value.artworkPersonal || value.artworkCommercial) &&
        (foundAccount.capabilities.card_payments !== 'active' ||
          foundAccount.capabilities.platform_payments !== 'active')
      ) {
        throw createError(
          400,
          'Please complete your Stripe account before making your artwork commercially available'
        );
      }
    }
    const newVersion = new Version();
    newVersion.cover = value.artworkCover || '';
    newVersion.media = value.artworkMedia || '';
    newVersion.title = value.artworkTitle || '';
    newVersion.type = value.artworkType || '';
    newVersion.availability = value.artworkAvailability || '';
    newVersion.license = value.artworkLicense || '';
    newVersion.use = value.artworkUse || '';
    newVersion.personal = currency(value.artworkPersonal).intValue || 0;
    newVersion.commercial =
      currency(value.artworkCommercial).add(value.artworkPersonal).intValue ||
      currency(value.artworkPersonal).intValue;
    newVersion.category = value.artworkCategory || '';
    newVersion.description = value.artworkDescription || '';
    const savedVersion = await newVersion.save({ session });
    const newArtwork = new Artwork();
    newArtwork.owner = res.locals.user.id;
    newArtwork.active = true;
    newArtwork.comments = [];
    newArtwork.current = savedVersion._id;
    newArtwork.saves = 0;
    const savedArtwork = await newArtwork.save({ session });
    savedVersion.artwork = savedArtwork._id;
    await savedVersion.save({ session });
    await User.updateOne(
      { _id: res.locals.user.id },
      { $push: { artwork: newArtwork._id } }
    ).session(session);
    await session.commitTransaction();
    return res.status(200).json('/my_artwork');
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
// needs testing
const updateArtwork = async (req, res, next) => {
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
    const { error, value } = putArtworkValidator(sanitize(req.body));
    if (error) throw createError(400, error);
    if (foundArtwork) {
      if (value.artworkPersonal || value.artworkCommercial) {
        const foundUser = await User.findOne({
          $and: [{ _id: res.locals.user.id }, { active: true }],
        });
        if (!foundUser) throw createError(400, 'User not found');
        if (!foundUser.stripeId)
          throw createError(
            400,
            'Please complete the Stripe onboarding process before making your artwork commercially available'
          );
        const foundAccount = await stripe.accounts.retrieve(foundUser.stripeId);
        if (
          (value.artworkPersonal || value.artworkCommercial) &&
          (foundAccount.capabilities.card_payments !== 'active' ||
            foundAccount.capabilities.platform_payments !== 'active')
        ) {
          throw createError(
            400,
            'Please complete your Stripe account before making your artwork commercially available'
          );
        }
      }
      const newVersion = new Version();
      newVersion.cover = value.artworkCover || '';
      newVersion.media = value.artworkMedia || '';
      newVersion.title = value.artworkTitle || '';
      newVersion.type = value.artworkType || '';
      newVersion.availability = value.artworkAvailability || '';
      newVersion.license = value.artworkLicense || '';
      newVersion.use = value.artworkUse || '';
      newVersion.personal = currency(value.artworkPersonal).intValue || 0;
      newVersion.commercial =
        currency(value.artworkCommercial).add(value.artworkPersonal).intValue ||
        currency(value.artworkPersonal).intValue;
      newVersion.category = value.artworkCategory || '';
      newVersion.description = value.artworkDescription || '';
      const savedVersion = await newVersion.save({ session });
      const foundOrder = await Order.find({
        details: { $elemMatch: { artwork: foundArtwork._id } },
        details: { $elemMatch: { version: foundArtwork.current._id } },
      })
        .deepPopulate('details.artwork details.version')
        .session(session);
      if (!(foundOrder && foundOrder.length)) {
        if (!foundArtwork.versions.length) {
          if (foundArtwork.current.media != savedVersion.media) {
            const coverLink = foundArtwork.current.cover;
            const coverFolderName = 'artworkCovers/';
            const coverFileName = coverLink.split('/').slice(-1)[0];
            const coverFilePath = coverFolderName + coverFileName;
            const coverS3 = new aws.S3();
            const coverParams = {
              Bucket: 'vesper-testing',
              Key: coverFilePath,
            };

            await coverS3.deleteObject(coverParams).promise();

            const mediaLink = foundArtwork.current.media;
            const mediaFolderName = 'artworkMedia/';
            const mediaFileName = mediaLink.split('/').slice(-1)[0];
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
            foundArtwork.current = savedVersion._id;
          } else {
            await Version.remove({
              _id: foundArtwork.current._id,
            }).session(session);
            foundArtwork.current = savedVersion._id;
          }
        } else {
          let usedContent = false;
          foundArtwork.versions.map(function (version) {
            if (
              version.media == foundArtwork.current.media &&
              version.cover == foundArtwork.current.cover
            ) {
              usedContent = true;
            }
          });
          if (usedContent) {
            await Version.remove({
              _id: foundArtwork.current._id,
            }).session(session);
            foundArtwork.current = savedVersion._id;
          } else {
            if (foundArtwork.current.media != savedVersion.media) {
              const coverLink = foundArtwork.current.cover;
              const coverFolderName = 'artworkCovers/';
              const coverFileName = coverLink.split('/').slice(-1)[0];
              const coverFilePath = coverFolderName + coverFileName;
              const coverS3 = new aws.S3();
              const coverParams = {
                Bucket: 'vesper-testing',
                Key: coverFilePath,
              };

              await coverS3.deleteObject(coverParams).promise();

              const mediaLink = foundArtwork.current.media;
              const mediaFolderName = 'artworkMedia/';
              const mediaFileName = mediaLink.split('/').slice(-1)[0];
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
              foundArtwork.current = savedVersion._id;
            } else {
              await Version.remove({
                _id: foundArtwork.current._id,
              }).session(session);
              foundArtwork.current = savedVersion._id;
            }
          }
        }
      } else {
        foundArtwork.versions.push(foundArtwork.current._id);
        foundArtwork.current = savedVersion._id;
      }
      await foundArtwork.save({ session });
      await session.commitTransaction();
      return res.status(200).json('/my_artwork');
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
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
const saveArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId } = req.params;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }],
    }).session(session);
    if (foundArtwork) {
      const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
        session
      );
      if (foundUser) {
        if (!foundUser.savedArtwork.includes(foundArtwork._id)) {
          await User.updateOne(
            { _id: foundUser._id },
            { $push: { savedArtwork: foundArtwork._id } }
          ).session(session);
          foundArtwork.saves++;
          await foundArtwork.save({ session });
          await session.commitTransaction();
          res.status(200).json({ message: 'Artwork saved' });
        } else {
          throw createError(400, 'Artwork could not be saved');
        }
      } else {
        throw createError(400, 'User not found');
      }
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

const unsaveArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId } = req.params;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }],
    }).session(session);
    if (foundArtwork) {
      const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
        session
      );
      if (foundUser) {
        if (foundUser.savedArtwork.includes(foundArtwork._id)) {
          await User.updateOne(
            { _id: foundUser._id },
            { $pull: { savedArtwork: foundArtwork._id } }
          ).session(session);
          foundArtwork.saves--;
          await foundArtwork.save({ session });
          await session.commitTransaction();
          res.status(200).json({ message: 'Artwork unsaved' });
        } else {
          throw createError(400, 'Artwork could not be unsaved');
        }
      } else {
        throw createError(400, 'User not found');
      }
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const saveLicenses = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { artworkId } = req.params;
    const { licenses } = req.body;
    if (licenses.length) {
      const foundArtwork = await Artwork.findOne({
        $and: [{ _id: artworkId }, { active: true }],
      })
        .populate(
          'current',
          '_id cover created title personal type license availability description use commercial'
        )
        .session(session);
      if (foundArtwork) {
        const licenseSet = [];
        const licenseIds = [];
        licenses.forEach(async (license) => {
          const newLicense = new License();
          newLicense.owner = res.locals.user.id;
          newLicense.artwork = foundArtwork._id;
          newLicense.fingerprint = crypto.randomBytes(20).toString('hex');
          newLicense.type = license.licenseType;
          newLicense.active = false;
          newLicense.price =
            license.licenseType == 'commercial'
              ? foundArtwork.current.commercial
              : foundArtwork.current.personal;
          licenseSet.push(newLicense);
        });
        const savedLicenses = await License.insertMany(licenseSet, { session });
        savedLicenses.forEach((license) => {
          licenseIds.push(license._id);
        });
        await User.updateOne(
          {
            _id: res.locals.user.id,
            cart: { $elemMatch: { artwork: foundArtwork._id } },
          },
          {
            $set: { 'cart.$.licenses': licenseIds },
          }
        ).session(session);
        await session.commitTransaction();
        res
          .status(200)
          .json({ message: 'Licenses saved', licenses: savedLicenses });
      } else {
        throw createError(400, 'Artwork not found');
      }
    } else {
      throw createError(400, 'Artwork needs to have at least one license');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
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
