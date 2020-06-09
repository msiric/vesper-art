import mongoose from 'mongoose';
import Artwork from '../models/artwork.js';
import Order from '../models/order.js';
import Version from '../models/version.js';
import Notification from '../models/notification.js';
import aws from 'aws-sdk';
import User from '../models/user.js';
import randomString from 'randomstring';
import mailer from '../utils/email.js';
import config from '../config/mailer.js';
import { server } from '../config/secret.js';
import auth from '../utils/auth.js';
import createError from 'http-errors';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET);

export const fetchUser = async ({ userId }) => {
  await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  });
};

export const getUserProfile = async ({ username, cursor, ceiling }) => {
  const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
  const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
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

export const getUserArtwork = async ({ userId, cursor, ceiling }) => {
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

export const getUserSaves = async ({ userId, cursor, ceiling }) => {
  const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
  const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
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

export const getUserStatistics = async ({ userId }) => {
  return await User.findOne({
    $and: [{ _id: userId }, { active: true }],
  }).deepPopulate(
    'purchases.version purchases.licenses sales.version sales.licenses'
  );
};

export const getUserSales = async ({ userId, from, to }) => {
  return from && to
    ? await Order.find({
        $and: [
          { seller: userId },
          { created: { $gte: new Date(from), $lt: new Date(to) } },
        ],
      }).populate('review version licenses sales.review')
    : await Order.find({
        $and: [{ seller: userId }],
      }).populate('review version licenses sales.review');
};

export const getUserPurchases = async ({ userId, from, to }) => {
  return from && to
    ? await Order.find({
        $and: [
          { buyer: userId },
          { created: { $gte: new Date(from), $lt: new Date(to) } },
        ],
      }).populate('review version licenses sales.review')
    : await Order.find({
        $and: [{ buyer: userId }],
      }).populate('review version licenses sales.review');
};

export const updateUserProfile = async ({
  userId,
  userPhoto,
  userDescription,
  userCountry,
}) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { photo: userPhoto, description: userDescription, country: userCountry }
  );
};

export const getUserNotifications = async ({ userId, cursor, ceiling }) => {
  const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
  const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
  return await Notification.find({ receiver: userId }, undefined, {
    skip,
    limit,
  })
    .populate('user')
    .sort({ created: -1 });
};

export const updateUserEmail = async ({ userId, email, token }) => {
  return await User.updateOne(
    {
      $and: [{ _id: userId }, { active: true }],
    },
    { email: email, verificationToken: token, verified: false }
  ).session(session);
};

export const updateUserPassword = async ({ userId, password }) => {
  return await User.updateOne({ _id: userId }, { password: password }).session(
    session
  );
};

export const updateUserPreferences = async ({ userId, displaySaves }) => {
  return await User.updateOne(
    { _id: userId },
    { displaySaves: displaySaves }
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
