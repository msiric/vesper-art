const mongoose = require('mongoose');
const Artwork = require('../models/artwork');
const Order = require('../models/order');
const Version = require('../models/version');
const aws = require('aws-sdk');
const User = require('../models/user');
const randomString = require('randomstring');
const mailer = require('../utils/email');
const config = require('../config/mailer');
const secret = require('../config/secret');
const auth = require('../utils/auth');
const createError = require('http-errors');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const getUserProfile = async (req, res, next) => {
  try {
    const { userName } = req.params;
    const foundUser = await User.findOne({
      $and: [{ name: userName }, { active: true }],
    }).deepPopulate('savedArtwork.current');
    // }).deepPopulate(
    //   'artwork.current',
    //   '_id cover created title personal type license availability description use commercial'
    // );
    if (foundUser) {
      const foundArtwork = await Artwork.find({
        $and: [{ owner: foundUser._id }, { active: true }],
      })
        .populate('owner')
        .populate(
          'current',
          '_id cover created title personal type license availability description use commercial'
        );
      return res.json({ user: foundUser, artwork: foundArtwork });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    next(err, res);
  }
};

const getUserStatistics = async (req, res, next) => {
  try {
    // brisanje accounta
    /*     stripe.accounts.del('acct_1Gi3zvL1KEMAcOES', function (err, confirmation) {
    }); */
    const { userId } = req.params;
    const foundUser = await User.findOne({
      $and: [{ _id: userId }, { active: true }],
    }).deepPopulate(
      'purchases.version purchases.licenses sales.version sales.licenses'
    );
    const balance = await stripe.balance.retrieve({
      stripe_account: foundUser.stripeId,
    });
    const { amount, currency } = balance.available[0];
    return res.json({ statistics: foundUser, amount: amount });
  } catch (err) {
    next(err, res);
  }
};

const getUserSales = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { from, to } = req.query;
    const foundOrders =
      from && to
        ? await Order.find({
            $and: [
              { seller: userId },
              { created: { $gte: new Date(from), $lt: new Date(to) } },
            ],
          }).populate('review version licenses sales.review')
        : await Order.find({
            $and: [{ seller: userId }],
          }).populate('review version licenses sales.review');
    return res.json({ statistics: foundOrders, amount: amount });
  } catch (err) {
    next(err, res);
  }
};

const getUserPurchases = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { from, to } = req.query;
    const foundOrders =
      from && to
        ? await Order.find({
            $and: [
              { buyer: userId },
              { created: { $gte: new Date(from), $lt: new Date(to) } },
            ],
          }).populate('review version licenses sales.review')
        : await Order.find({
            $and: [{ buyer: userId }],
          }).populate('review version licenses sales.review');
    return res.json({ statistics: foundOrders });
  } catch (err) {
    next(err, res);
  }
};

const updateUserProfile = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.params;
    const { userPhoto, userDescription, userCountry } = req.body;
    const foundUser = await User.findOne({
      $and: [{ _id: userId }, { active: true }],
    });
    if (foundUser) {
      if (userPhoto) foundUser.photo = userPhoto;
      if (userDescription) foundUser.description = userDescription;
      if (userCountry) foundUser.country = userCountry;
      await foundUser.save({ session });
      await session.commitTransaction();
      return res.status(200).json({ message: 'User details updated' });
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

const getUserSettings = async (req, res, next) => {
  console.log(res.locals.user);
  try {
    const { userId } = req.params;
    const foundUser = await User.findOne({
      $and: [{ _id: userId }, { active: true }],
    });
    if (foundUser) {
      return res.json({ user: foundUser });
    } else {
      throw createError(400, 'User not found');
    }
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (done)
const updateUserEmail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.params;
    const { email } = req.body;
    const foundUser = await User.findOne({
      $and: [{ email: email }, { active: true }],
    }).session(session);
    if (foundUser) {
      throw createError(400, 'User with entered email already exists');
    } else {
      const token = randomString.generate();
      const link = `${secret.server.clientDomain}/verify_token/${token}`;
      await User.updateOne(
        {
          $and: [{ _id: userId }, { active: true }],
        },
        { email: email, verificationToken: token, verified: false }
      ).session(session);
      await mailer.sendEmail(
        config.app,
        email,
        'Please confirm your email',
        `Hello,
        Please click on the link to verify your email:

        <a href=${link}>Click here to verify</a>`
      );
      await session.commitTransaction();
      return res.status(200).json({ message: 'Email successfully updated' });
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (done)
const updateUserPassword = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId } = req.params;
    const foundUser = await User.findOne({ _id: userId }).session(session);
    if (foundUser) {
      const { current, password, confirmPassword } = req.body;
      if (current && password && confirmPassword) {
        if (foundUser.comparePassword(current)) {
          if (password === confirmPassword) {
            foundUser.password = password;
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
    const { userId } = req.params;
    const foundUser = await User.findOne({ _id: userId }).session(session);
    if (foundUser) {
      const { displaySaves } = req.body;
      foundUser.displaySaves = displaySaves;
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

const getUserDashboard = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const balance = await stripe.balance.retrieve({
      stripe_account: user.stripeId,
    });

    res.render('dashboard', {
      pilot: pilot,
      balanceAvailable: balance.available[0].amount,
      balancePending: balance.pending[0].amount,
      ridesTotalAmount: ridesTotalAmount,
      rides: rides,
      showBanner: !!showBanner || req.query.showBanner,
    });
  } catch (err) {
    next(err, res);
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

module.exports = {
  getUserProfile,
  getUserStatistics,
  getUserSales,
  getUserPurchases,
  updateUserProfile,
  getUserSettings,
  updateUserEmail,
  updateUserPassword,
  updateUserPreferences,
  deactivateUser,
};
