const mongoose = require('mongoose');
const Artwork = require('../models/artwork');
const Order = require('../models/order');
const Version = require('../models/version');
const aws = require('aws-sdk');
const passport = require('passport');
const passportConfig = require('../config/passport');
const User = require('../models/user');
const randomString = require('randomstring');
const axios = require('axios');
const createError = require('http-errors');

const getSignUp = async (req, res, next) => {
  try {
    res.render('accounts/signup');
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (not tested)
const postSignUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({
      $or: [{ email: req.body.email }, { name: req.body.username }]
    }).session(session);
    if (foundUser) {
      throw createError(400, 'Account with that email/username already exists');
    } else {
      let verificationInfo = {
        token: randomString.generate(),
        email: req.body.email
      };
      let user = new User();
      user.name = req.body.username;
      user.email = req.body.email;
      user.photo = user.gravatar();
      user.password = req.body.password;
      user.customWork = true;
      user.secretToken = verificationInfo.token;
      user.verified = false;
      user.cart = [];
      user.discount = null;
      user.inbox = 0;
      user.notifications = 0;
      user.rating = 0;
      user.reviews = 0;
      user.savedArtwork = [];
      user.earnings = 0;
      user.incomingFunds = 0;
      user.outgoingFunds = 0;
      user.active = true;
      await user.save({ session });
      await axios.post('http://localhost:3000/send_email', verificationInfo, {
        proxy: false
      });
      // old code
      /*         axios
          .post('http://localhost:3000/send_email', verificationInfo, {
            proxy: false
          })
          .then(res => {
            console.log(`statusCode: ${res.statusCode}`);
            console.log(res);
          })
          .catch(error => {
            console.error(error);
          }); */
      await session.commitTransaction();
      return res.redirect('/signup');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const getLogIn = async (req, res, next) => {
  try {
    res.render('accounts/login');
  } catch (err) {
    next(err, res);
  }
};

const postLogIn = passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
});

const getFacebookLogIn = passport.authenticate('facebook', { scope: 'email' });

const getFacebookCallback = passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
});

const getGoogleLogIn = passport.authenticate('google', { scope: 'email' });

const getGoogleCallback = passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
});

const getUserProfile = async (req, res, next) => {
  try {
    res.render('accounts/profile', { message: req.flash('success') });
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (done)
const updateUserProfile = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: req.user._id }, { active: true }]
    }).session(session);
    if (foundUser) {
      if (req.body.name) foundUser.name = req.body.name;
      if (req.body.email) foundUser.email = req.body.email;
      if (req.body.about) foundUser.about = req.body.about;
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

const getLogOut = async (req, res) => {
  try {
    req.session.destroy(function(err) {
      res.redirect('/');
    });
  } catch (err) {
    next(err, res);
  }
};

const getUserSettings = async (req, res) => {
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
    const foundUser = await User.findOne({ _id: req.user._id }).session(
      session
    );
    if (foundUser) {
      let current = req.body.current;
      let change = req.body.password;
      let confirm = req.body.confirm;
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
    const foundUser = await User.findOne({ _id: req.user._id }).session(
      session
    );
    if (foundUser) {
      let customWork = req.body.work;
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
      $and: [{ _id: req.user._id }, { active: true }]
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
            about: null,
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
      $and: [{ _id: req.user._id }, { active: true }]
    }).session(session);
    if (foundUser) {
      const foundArtwork = await Artwork.find({
        $and: [{ owner: req.user._id }, { active: true }]
      })
        .populate('current')
        .populate('versions')
        .session(session);
      if (foundArtwork) {
        foundArtwork.forEach(async function(artwork) {
          const foundOrder = await Order.find({
            details: { $elemMatch: { artwork: artwork._id } },
            details: { $elemMatch: { version: artwork.current._id } }
          })
            .deepPopulate('details.artwork details.version')
            .session(session);
          console.log('order', foundOrder);
          if (foundOrder.length) {
            await Artwork.updateOne(
              {
                _id: artwork._id
              },
              {
                active: false
              }
            ).session(session);
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
            await User.updateOne(
              { _id: foundUser._id },
              {
                $set: {
                  name: 'Deleted User',
                  password: null,
                  photo: foundUser.gravatar(),
                  about: null,
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
            ).session(session);
            await session.commitTransaction();
            req.logout();
            req.session.destroy(function(err) {
              res.status(200).json('/');
            });
          } else {
            console.log('length', artwork.versions.length);
            if (artwork.versions.length) {
              let usedContent = false;
              artwork.versions.map(function(version) {
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
                  _id: artwork.current._id
                }).session(session);
                await Artwork.updateOne(
                  {
                    _id: artwork._id
                  },
                  {
                    current: null,
                    active: false
                  }
                ).session(session);
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
                await User.updateOne(
                  { _id: foundUser._id },
                  {
                    $set: {
                      name: 'Deleted User',
                      password: null,
                      photo: foundUser.gravatar(),
                      about: null,
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
                ).session(session);
                await session.commitTransaction();
                req.logout();
                req.session.destroy(function(err) {
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
                  Key: coverFilePath
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
                  Key: mediaFilePath
                };

                await mediaS3.deleteObject(mediaParams).promise();

                await Version.remove({
                  _id: artwork.current._id
                }).session(session);

                await Artwork.updateOne(
                  {
                    _id: artwork._id
                  },
                  {
                    current: null,
                    active: false
                  }
                ).session(session);

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
                await User.updateOne(
                  { _id: foundUser._id },
                  {
                    $set: {
                      name: 'Deleted User',
                      password: null,
                      photo: foundUser.gravatar(),
                      about: null,
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
                ).session(session);

                await session.commitTransaction();
                req.logout();
                req.session.destroy(function(err) {
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
                Key: coverFilePath
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
                Key: mediaFilePath
              };

              await mediaS3.deleteObject(mediaParams).promise();

              await Version.remove({
                _id: artwork.current._id
              }).session(session);

              await Artwork.remove({
                _id: artwork._id
              }).session(session);

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
              await User.updateOne(
                { _id: foundUser._id },
                {
                  $set: {
                    name: 'Deleted User',
                    password: null,
                    photo: foundUser.gravatar(),
                    about: null,
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
              ).session(session);

              await session.commitTransaction();
              req.logout();
              req.session.destroy(function(err) {
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
  getSignUp,
  postSignUp,
  getLogIn,
  postLogIn,
  getFacebookLogIn,
  getFacebookCallback,
  getGoogleLogIn,
  getGoogleCallback,
  getUserProfile,
  updateUserProfile,
  getLogOut,
  getUserSettings,
  updateUserPassword,
  updateUserPreferences,
  deleteUser
};
