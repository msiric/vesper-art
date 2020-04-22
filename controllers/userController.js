const mongoose = require('mongoose');
const Artwork = require('../models/artwork');
const Order = require('../models/order');
const Version = require('../models/version');
const aws = require('aws-sdk');
const User = require('../models/user');
const createError = require('http-errors');

const getUserProfile = async (req, res, next) => {
  try {
    const { userName } = req.params;
    const foundUser = await User.findOne({
      $and: [{ name: userName }, { active: true }],
    });
    // }).deepPopulate(
    //   'artwork.current',
    //   '_id cover created title price type license availability description use commercial'
    // );
    if (foundUser) {
      const foundArtwork = await Artwork.find({
        $and: [{ owner: foundUser._id }, { active: true }],
      }).populate(
        'current',
        '_id cover created title price type license availability description use commercial'
      );
      return res.json({ user: foundUser, artwork: foundArtwork });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (done)
const updateUserProfile = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { username, email, description } = req.body;
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    }).session(session);
    if (foundUser) {
      if (username) foundUser.name = username;
      if (email) foundUser.email = email;
      if (description) foundUser.description = description;
      await foundUser.save({ session });
      await session.commitTransaction();
      return res
        .status(200)
        .json({ message: 'User details successfully updated' });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// treba sredit
const getUserSettings = async (req, res, next) => {
  try {
    return res
      .status(200)
      .render('accounts/settings', { customWork: req.user.customWork });
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (done)
const updateUserPassword = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
      session
    );
    if (foundUser) {
      const { current, password, confirm } = req.body;
      if (current && change && confirm) {
        if (foundUser.comparePassword(current)) {
          if (change === confirm) {
            foundUser.password = change;
            await foundUser.save({ session });
            await session.commitTransaction();
            return res
              .status(200)
              .json({ message: 'Password updated successfully' });
          } else {
            throw createError(400, 'New passwords do not match');
          }
        } else {
          throw createError(400, 'Current password incorrect');
        }
      } else {
        throw createError(400, 'All fields need to be filled out');
      }
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const updateUserPreferences = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
      session
    );
    if (foundUser) {
      const { customWork } = req.body;
      foundUser.customWork = customWork ? true : false;
      await foundUser.save({ session });
      await session.commitTransaction();
      return res
        .status(200)
        .json({ message: 'Preferences updated successfully' });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

/* const deleteUser = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }]
    });
    if (foundUser) {
      if (foundUser.photo.includes(foundUser._id)) {
        const folderName = 'profilePhotos/';
        const fileName = foundUser.photo.split('/').slice(-1)[0];
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: 'vesper-testing',
          Key: filePath
        };
        await s3.deleteObject(params).promise();
      }
      const updatedUser = await User.updateOne(
        { _id: foundUser._id },
        {
          $set: {
            name: 'Deleted User',
            password: null,
            photo: foundUser.gravatar(),
            description: null,
            facebookId: null,
            googleId: null,
            customWork: false,
            secretToken: null,
            verified: false,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            cart: null,
            discount: null,
            inbox: null,
            notifications: null,
            rating: null,
            reviews: null,
            savedArtwork: null,
            earnings: null,
            incomingFunds: null,
            outgoingFunds: null,
            escrow: null,
            active: false
          }
        }
      );
      if (updatedUser) {
        req.logout();
        req.session.destroy(function(err) {
          res.status(200).json('/');
        });
      } else {
        return res.status(400).json({ message: 'User could not be deleted' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
}; */

// needs testing (better way to update already found user)
// not tested
// needs transaction (not tested)
const deleteUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: res.locals.user.id }, { active: true }],
    }).session(session);
    if (foundUser) {
      const foundArtwork = await Artwork.find({
        $and: [{ owner: res.locals.user.id }, { active: true }],
      })
        .populate('current')
        .populate('versions')
        .session(session);
      if (foundArtwork) {
        foundArtwork.forEach(async function (artwork) {
          const foundOrder = await Order.find({
            details: { $elemMatch: { artwork: artwork._id } },
            details: { $elemMatch: { version: artwork.current._id } },
          })
            .deepPopulate('details.artwork details.version')
            .session(session);
          console.log('order', foundOrder);
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
                  name: 'Deleted User',
                  password: null,
                  photo: foundUser.gravatar(),
                  description: null,
                  facebookId: null,
                  googleId: null,
                  customWork: false,
                  secretToken: null,
                  verified: false,
                  resetPasswordToken: null,
                  resetPasswordExpires: null,
                  cart: null,
                  discount: null,
                  inbox: null,
                  notifications: null,
                  rating: null,
                  reviews: null,
                  artwork: null,
                  savedArtwork: null,
                  earnings: null,
                  incomingFunds: null,
                  outgoingFunds: null,
                  escrow: null,
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
            console.log('length', artwork.versions.length);
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
              console.log('used content', usedContent);
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
                      name: 'Deleted User',
                      password: null,
                      photo: foundUser.gravatar(),
                      description: null,
                      facebookId: null,
                      googleId: null,
                      customWork: false,
                      secretToken: null,
                      verified: false,
                      resetPasswordToken: null,
                      resetPasswordExpires: null,
                      cart: null,
                      discount: null,
                      inbox: null,
                      notifications: null,
                      rating: null,
                      reviews: null,
                      artwork: null,
                      savedArtwork: null,
                      earnings: null,
                      incomingFunds: null,
                      outgoingFunds: null,
                      escrow: null,
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
                      name: 'Deleted User',
                      password: null,
                      photo: foundUser.gravatar(),
                      description: null,
                      facebookId: null,
                      googleId: null,
                      customWork: false,
                      secretToken: null,
                      verified: false,
                      resetPasswordToken: null,
                      resetPasswordExpires: null,
                      cart: null,
                      discount: null,
                      inbox: null,
                      notifications: null,
                      rating: null,
                      reviews: null,
                      artwork: null,
                      savedArtwork: null,
                      earnings: null,
                      incomingFunds: null,
                      outgoingFunds: null,
                      escrow: null,
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
                    name: 'Deleted User',
                    password: null,
                    photo: foundUser.gravatar(),
                    description: null,
                    facebookId: null,
                    googleId: null,
                    customWork: false,
                    secretToken: null,
                    verified: false,
                    resetPasswordToken: null,
                    resetPasswordExpires: null,
                    cart: null,
                    discount: null,
                    inbox: null,
                    notifications: null,
                    rating: null,
                    reviews: null,
                    artwork: null,
                    savedArtwork: null,
                    earnings: null,
                    incomingFunds: null,
                    outgoingFunds: null,
                    escrow: null,
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
          }
        });
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

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  updateUserPassword,
  updateUserPreferences,
  deleteUser,
};
