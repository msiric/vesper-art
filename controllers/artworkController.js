const mongoose = require('mongoose');
const aws = require('aws-sdk');
const User = require('../models/user');
const Artwork = require('../models/artwork');
const Version = require('../models/version');
const Comment = require('../models/comment');
const Order = require('../models/order');
const createError = require('http-errors');
const { sanitize } = require('../utils/helpers');
const postArtworkValidator = require('../utils/validation/postArtworkValidator');
const putArtworkValidator = require('../utils/validation/putArtworkValidator');

const getArtwork = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.find({ active: true })
      .populate('owner')
      .populate(
        'current',
        '_id cover created title price use license available description'
      );
    return res.json({ artwork: foundArtwork });
  } catch (err) {
    next(err, res);
  }
};

const getUserArtwork = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.find({
      $and: [{ owner: res.locals.user.id }, { active: true }],
    }).populate(
      'current',
      '_id cover created title price use license available description'
    );
    return res.json({ artwork: foundArtwork });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

// needs transaction (done)
const postNewArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error, value } = postArtworkValidator(sanitize(req.body));
    if (error) throw createError(400, error);
    const newVersion = new Version();
    newVersion.cover = value.artworkCover;
    newVersion.media = value.artworkMedia;
    newVersion.title = value.artworkTitle;
    newVersion.type = value.artworkType;
    newVersion.category = value.artworkCategory;
    newVersion.price = 0;
    newVersion.use = 'personal';
    newVersion.license = 0;
    newVersion.available = true;
    newVersion.description = value.artworkDescription;
    if (value.artworkType && value.artworkType == 'commercial') {
      newVersion.price = value.artworkPrice;
      if (value.artworkLicense && value.artworkLicense == 'commercial') {
        newVersion.use = 'commercial';
        newVersion.license = value.artworkCommercial;
      }
    } else {
      newVersion.available =
        value.artworkAvailability == 'available' ? true : false;
    }
    const savedVersion = await newVersion.save({ session });
    const newArtwork = new Artwork();
    newArtwork.owner = res.locals.user.id;
    newArtwork.active = true;
    newArtwork.comments = [];
    newArtwork.current = savedVersion._id;
    await newArtwork.save({ session });
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

// treba sredit
const getArtworkDetails = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { active: true }],
    })
      .populate('owner')
      .populate('comments')
      .populate(
        'current',
        '_id cover created title price use license available description'
      );
    if (foundArtwork) {
      const savedArtwork =
        req.user && req.user.savedArtwork.includes(req.params.id)
          ? true
          : false;
      const inCart =
        req.user &&
        req.user.cart.length > 0 &&
        req.user.cart.some((item) => item.artwork._id.equals(req.params.id))
          ? true
          : false;

      return res.json({
        artwork: foundArtwork,
        inCart,
        savedArtwork,
      });
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const editArtwork = async (req, res, next) => {
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [
        { _id: req.params.id },
        { owner: res.locals.user.id },
        { active: true },
      ],
    }).populate('current');
    if (foundArtwork) {
      return res.json({ artwork: foundArtwork.current });
    } else {
      throw createError(400, 'Artwork not found');
    }
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

// needs transaction (done)
// does it work in all cases?
// needs testing
const updateArtwork = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundArtwork = await Artwork.findOne({
      $and: [
        { _id: req.params.id },
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
      const newVersion = new Version();
      newVersion.cover = value.artworkCover
        ? value.artworkCover
        : foundArtwork.current.cover;
      newVersion.media = value.artworkMedia
        ? value.artworkMedia
        : foundArtwork.current.media;
      newVersion.title = value.artworkTitle
        ? value.artworkTitle
        : foundArtwork.current.title;
      newVersion.type = value.artworkType
        ? value.artworkType
        : foundArtwork.current.type;
      newVersion.category = value.artworkCategory
        ? value.artworkCategory
        : foundArtwork.current.category;
      newVersion.description = value.artworkDescription
        ? value.artworkDescription
        : foundArtwork.current.description;
      newVersion.category = value.artworkCategory
        ? value.artworkCategory
        : foundArtwork.current.category;
      if (value.artworkType && value.artworkType == 'commercial') {
        newVersion.price = value.artworkPrice;
        newVersion.available = true;
        if (value.artworkLicense && value.artworkLicense == 'commercial') {
          newVersion.use = 'commercial';
          newVersion.license = value.artworkCommercial;
        } else {
          newVersion.use = 'personal';
          newVersion.license = 0;
        }
      } else {
        newVersion.use = 'personal';
        newVersion.price = 0;
        newVersion.license = 0;
        newVersion.available =
          value.artworkAvailability == 'available' ? true : false;
      }
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
    const foundArtwork = await Artwork.findOne({
      $and: [
        { _id: req.params.id },
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
            _id: req.params.id,
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
                _id: req.params.id,
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
                _id: req.params.id,
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
            _id: req.params.id,
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
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: req.params.id }, { active: true }],
    })
      .populate(
        'current',
        '_id cover created title price use license available description'
      )
      .session(session);
    if (foundArtwork) {
      const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
        session
      );
      if (foundUser) {
        let saved;
        if (foundUser.savedArtwork.includes(foundArtwork._id)) {
          await User.updateOne(
            { _id: foundUser._id },
            { $pull: { savedArtwork: req.params.id } }
          ).session(session);
          saved = false;
        } else {
          await User.updateOne(
            { _id: foundUser._id },
            { $push: { savedArtwork: req.params.id } }
          ).session(session);
          saved = true;
        }
        await session.commitTransaction();
        res.status(200).json({ saved });
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
module.exports = {
  getArtwork,
  getUserArtwork,
  postNewArtwork,
  getArtworkDetails,
  editArtwork,
  updateArtwork,
  deleteArtwork,
  saveArtwork,
};
