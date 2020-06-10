import mongoose from 'mongoose';
import Artwork from '../models/artwork.js';
import Order from '../models/order.js';
import Version from '../models/version.js';
import Notification from '../models/notification.js';
import aws from 'aws-sdk';
import User from '../models/user.js';
import auth from '../utils/auth.js';
import createError from 'http-errors';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET);

export const fetchUserById = async ({ userId, session = null }) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  });
};

export const fetchUserByEmail = async ({ email, session = null }) => {
  return await User.findOne({
    $and: [{ email: email }, { active: true }],
  }).session(session);
};

export const fetchUserByToken = async ({ tokenId, session = null }) => {
  return await User.findOne({
    resetToken: tokenId,
    resetExpiry: { $gt: Date.now() },
  }).session(session);
};

export const fetchUserByCreds = async ({ username, session = null }) => {
  return await User.findOne({
    $and: [
      { $or: [{ email: username }, { name: username }] },
      { active: true },
    ],
  }).session(session);
};

export const fetchUserDiscount = async ({ userId, session = null }) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  }).populate('discount');
};

export const fetchUserSales = async ({ userId, session = null }) => {
  return await User.findOne({
    _id: userId,
  }).deepPopulate('sales.buyer sales.version sales.review');
};

export const fetchUserPurchases = async ({ userId, session = null }) => {
  return await User.findOne({
    _id: userId,
  }).deepPopulate('purchases.seller purchases.version purchases.review');
};

export const fetchUserProfile = async ({
  username,
  skip,
  limit,
  session = null,
}) => {
  return await User.findOne({
    $and: [{ name: username }, { active: true }],
  }).populate(
    skip && limit
      ? {
          path: 'artwork',
          options: {
            limit,
            skip,
          },
          populate: {
            path: 'current',
          },
        }
      : {
          path: 'artwork',
          populate: {
            path: 'current',
          },
        }
  );
};

export const fetchUserArtwork = async ({
  userId,
  cursor,
  ceiling,
  session = null,
}) => {
  const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
  const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
  return await Artwork.find(
    {
      $and: [{ owner: userId }, { active: true }],
    },
    undefined,
    {
      skip,
      limit,
    }
  );
};

export const fetchUserSaves = async ({
  userId,
  skip,
  limit,
  session = null,
}) => {
  return await User.findOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    undefined,
    {
      skip,
      limit,
    }
  ).populate({
    path: 'savedArtwork',
    options: {
      limit,
      skip,
    },
    populate: {
      path: 'current',
    },
  });
};

export const fetchUserStatistics = async ({ userId, session = null }) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  }).deepPopulate(
    'purchases.version purchases.licenses sales.version sales.licenses'
  );
};

export const editUserProfile = async ({
  userId,
  userPhoto,
  userDescription,
  userCountry,
  session = null,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { photo: userPhoto, description: userDescription, country: userCountry }
  );
};

export const fetchUserNotifications = async ({
  userId,
  skip,
  limit,
  session = null,
}) => {
  return await Notification.find({ receiver: userId }, undefined, {
    skip,
    limit,
  })
    .populate('user')
    .sort({ created: -1 });
};

export const editUserEmail = async ({
  userId,
  email,
  token,
  session = null,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { email: email, verificationToken: token, verified: false }
  ).session(session);
};

export const editUserPassword = async ({
  userId,
  password,
  session = null,
}) => {
  return await User.updateOne({ _id: userId }, { password: password }).session(
    session
  );
};

export const editUserPreferences = async ({
  userId,
  displaySaves,
  session = null,
}) => {
  return await User.updateOne(
    { _id: userId },
    { displaySaves: displaySaves }
  ).session(session);
};

export const addUserSave = async ({ userId, artworkId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $push: { savedArtwork: artworkId } }
  ).session(session);
};

export const removeUserSave = async ({ userId, artworkId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $pull: { savedArtwork: artworkId } }
  ).session(session);
};

export const addUserNotification = async ({ userId, session = null }) => {
  return await User.updateOne(
    { _id: userId },
    { $inc: { notifications: 1 } }
  ).session(session);
};

export const editUserRating = async ({
  userId,
  userRating,
  session = null,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    {
      rating: userRating,
      $inc: { reviews: 1, notifications: 1 },
    }
  ).session(session);
};

// needs testing (better way to update already found user)
// not tested
// needs transaction (not tested)
const deactivateUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.params;
    const foundUser = await User.findOne({
      $and: [{ _id: userId }, { active: true }],
    }).session(session);
    if (foundUser) {
      const foundArtwork = await Artwork.find({
        $and: [{ owner: res.locals.user.id }, { active: true }],
      })
        .populate('current')
        .populate('versions')
        .session(session);
      if (foundArtwork) {
        for (let artwork of foundArtwork) {
          const foundOrder = await Order.find({
            details: { $elemMatch: { artwork: artwork._id } },
            details: { $elemMatch: { version: artwork.current._id } },
          })
            .deepPopulate('details.artwork details.version')
            .session(session);
          if (foundOrder.length) {
            await Artwork.updateOne(
              {
                _id: artwork._id,
              },
              {
                active: false,
              }
            ).session(session);
            if (foundUser.photo.includes(foundUser._id)) {
              const folderName = 'profilePhotos/';
              const fileName = foundUser.photo.split('/').slice(-1)[0];
              const filePath = folderName + fileName;
              const s3 = new aws.S3();
              const params = {
                Bucket: 'vesper-testing',
                Key: filePath,
              };
              await s3.deleteObject(params).promise();
            }
            await User.updateOne(
              { _id: foundUser._id },
              {
                $set: {
                  name: null,
                  email: null,
                  password: null,
                  photo: foundUser.gravatar(),
                  description: null,
                  facebookId: null,
                  googleId: null,
                  customWork: false,
                  displaySaves: false,
                  verificationToken: null,
                  verified: false,
                  resetToken: null,
                  resetExpiry: null,
                  cart: null,
                  discount: null,
                  inbox: null,
                  notifications: null,
                  rating: null,
                  reviews: null,
                  artwork: null,
                  savedArtwork: null,
                  purchases: null,
                  sales: null,
                  stripeId: null,
                  active: false,
                },
              }
            ).session(session);
            await session.commitTransaction();
            req.logout();
            req.session.destroy(function (err) {
              res.status(200).json('/');
            });
          } else {
            if (artwork.versions.length) {
              let usedContent = false;
              artwork.versions.map(function (version) {
                if (
                  version.media == artwork.current.media &&
                  version.cover == artwork.current.cover
                ) {
                  usedContent = true;
                }
              });
              if (usedContent) {
                await Version.remove({
                  _id: artwork.current._id,
                }).session(session);
                await Artwork.updateOne(
                  {
                    _id: artwork._id,
                  },
                  {
                    current: null,
                    active: false,
                  }
                ).session(session);
                if (foundUser.photo.includes(foundUser._id)) {
                  const folderName = 'profilePhotos/';
                  const fileName = foundUser.photo.split('/').slice(-1)[0];
                  const filePath = folderName + fileName;
                  const s3 = new aws.S3();
                  const params = {
                    Bucket: 'vesper-testing',
                    Key: filePath,
                  };
                  await s3.deleteObject(params).promise();
                }
                await User.updateOne(
                  { _id: foundUser._id },
                  {
                    $set: {
                      name: null,
                      email: null,
                      password: null,
                      photo: foundUser.gravatar(),
                      description: null,
                      facebookId: null,
                      googleId: null,
                      customWork: false,
                      displaySaves: false,
                      verificationToken: null,
                      verified: false,
                      resetToken: null,
                      resetExpiry: null,
                      cart: null,
                      discount: null,
                      inbox: null,
                      notifications: null,
                      rating: null,
                      reviews: null,
                      artwork: null,
                      savedArtwork: null,
                      sales: null,
                      purchases: null,
                      stripeId: null,
                      active: false,
                    },
                  }
                ).session(session);
                await session.commitTransaction();
                req.logout();
                req.session.destroy(function (err) {
                  res.status(200).json('/');
                });
              } else {
                const coverFolderName = 'artworkCovers/';
                const coverFileName = artwork.current.cover
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
                const mediaFileName = artwork.current.media
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
                  _id: artwork.current._id,
                }).session(session);

                await Artwork.updateOne(
                  {
                    _id: artwork._id,
                  },
                  {
                    current: null,
                    active: false,
                  }
                ).session(session);

                if (foundUser.photo.includes(foundUser._id)) {
                  const folderName = 'profilePhotos/';
                  const fileName = foundUser.photo.split('/').slice(-1)[0];
                  const filePath = folderName + fileName;
                  const s3 = new aws.S3();
                  const params = {
                    Bucket: 'vesper-testing',
                    Key: filePath,
                  };
                  await s3.deleteObject(params).promise();
                }
                await User.updateOne(
                  { _id: foundUser._id },
                  {
                    $set: {
                      name: null,
                      email: null,
                      password: null,
                      photo: foundUser.gravatar(),
                      description: null,
                      facebookId: null,
                      googleId: null,
                      customWork: false,
                      displaySaves: false,
                      verificationToken: null,
                      verified: false,
                      resetToken: null,
                      resetExpiry: null,
                      cart: null,
                      discount: null,
                      inbox: null,
                      notifications: null,
                      rating: null,
                      reviews: null,
                      artwork: null,
                      savedArtwork: null,
                      sales: null,
                      purchases: null,
                      stripeId: null,
                      active: false,
                    },
                  }
                ).session(session);

                await session.commitTransaction();
                req.logout();
                req.session.destroy(function (err) {
                  res.status(200).json('/');
                });
              }
            } else {
              const coverFolderName = 'artworkCovers/';
              const coverFileName = artwork.current.cover
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
              const mediaFileName = artwork.current.media
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
                _id: artwork.current._id,
              }).session(session);

              await Artwork.remove({
                _id: artwork._id,
              }).session(session);

              if (foundUser.photo.includes(foundUser._id)) {
                const folderName = 'profilePhotos/';
                const fileName = foundUser.photo.split('/').slice(-1)[0];
                const filePath = folderName + fileName;
                const s3 = new aws.S3();
                const params = {
                  Bucket: 'vesper-testing',
                  Key: filePath,
                };
                await s3.deleteObject(params).promise();
              }
              await User.updateOne(
                { _id: foundUser._id },
                {
                  $set: {
                    name: null,
                    email: null,
                    password: null,
                    photo: foundUser.gravatar(),
                    description: null,
                    facebookId: null,
                    googleId: null,
                    customWork: false,
                    displaySaves: false,
                    verificationToken: null,
                    verified: false,
                    resetToken: null,
                    resetExpiry: null,
                    cart: null,
                    discount: null,
                    inbox: null,
                    notifications: null,
                    rating: null,
                    reviews: null,
                    artwork: null,
                    savedArtwork: null,
                    sales: null,
                    purchases: null,
                    stripeId: null,
                    active: false,
                  },
                }
              ).session(session);
              auth.sendRefreshToken(res, '');
              res.json({
                accessToken: '',
                user: '',
              });
              await session.commitTransaction();
            }
          }
        }
      } else {
        throw createError(400, 'Artwork not found');
      }
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    next(err, res);
  } finally {
    session.endSession();
  }
};

export const addUserDiscount = async ({
  userId,
  discountId,
  session = null,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { discount: discountId }
  ).session(session);
};

export const removeUserDiscount = async ({ userId, session = null }) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { discount: null }
  ).session(session);
};
