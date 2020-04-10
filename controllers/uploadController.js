const mongoose = require('mongoose');
const aws = require('aws-sdk');
const User = require('../models/user');
const createError = require('http-errors');

// needs transaction (done)
const postProfileImage = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({ _id: res.locals.user.id }).session(
      session
    );
    if (foundUser) {
      const folderName = 'profilePhotos/';
      const fileName = foundUser.photo.split('/').slice(-1)[0];
      const filePath = folderName + fileName;
      const s3 = new aws.S3();
      const params = {
        Bucket: 'vesper-testing',
        Key: filePath,
      };
      await s3.deleteObject(params).promise();
      foundUser.photo = req.file.location;
      await foundUser.save({ session });
      await session.commitTransaction();
      return res.status(200).json({ imageUrl: req.file.location });
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

const postArtworkMedia = async (req, res, next) => {
  try {
    return res.status(200).json({
      artworkMedia: req.file.transforms[0].location,
      artworkCover: req.file.transforms[1].location,
    });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const putArtworkMedia = async (req, res, next) => {
  try {
    return res.status(200).json({
      artworkMedia: req.file.transforms[0].location,
      artworkCover: req.file.transforms[1].location,
    });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

/* const updateArtworkCover = async (req, res, next) => {
  try {
    const artworkId = req.params.id;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }]
    });
    if (foundArtwork && foundArtwork.cover) {
      const fileName = foundArtwork.cover.split('/').slice(-1)[0];
      const folderName = 'artworkCovers/';
      const filePath = folderName + fileName;
      const s3 = new aws.S3();
      const params = {
        Bucket: 'vesper-testing',
        Key: filePath
      };
      const deletedImage = await s3.deleteObject(params).promise();
      if (deletedImage) {
        foundArtwork.cover = req.file.location;
        const savedArtwork = await foundArtwork.save();
        if (savedArtwork) {
          return res.status(200).json({ imageUrl: req.file.location });
        } else {
          return res
            .status(400)
            .json({ message: 'Artwork cover could not be saved' });
        }
      } else {
        return res
          .status(400)
          .json({ message: 'Existing artwork cover could not be deleted' });
      }
    } else {
      return res.status(400).json({ message: 'Artwork cover not found' });
    }
  } catch (err) {
    next(err, res);
  }
}; */

/* const postArtworkMedia = async (req, res, next) => {
  try {
    console.log(req.file);
    return res.status(200).json({ imageUrl: req.file.location });
  } catch (err) {
    next(err, res);
  }
};

const updateArtworkMedia = async (req, res, next) => {
  try {
    const artworkId = req.params.id;
    const foundArtwork = await Artwork.findOne({
      $and: [{ _id: artworkId }, { active: true }]
    });
    if (foundArtwork && foundArtwork.media) {
      const fileName = foundArtwork.media.split('/').slice(-1)[0];
      const folderName = 'artworkMedia/';
      const filePath = folderName + fileName;
      const s3 = new aws.S3();
      const params = {
        Bucket: 'vesper-testing',
        Key: filePath
      };
      const deletedImage = await s3.deleteObject(params).promise();
      if (deletedImage) {
        foundArtwork.media = req.file.location;
        const savedArtwork = await foundArtwork.save();
        if (savedArtwork) {
          return res.status(200).json({ imageUrl: req.file.location });
        } else {
          return res
            .status(400)
            .json({ message: 'Artwork media could not be saved' });
        }
      } else {
        return res
          .status(400)
          .json({ message: 'Existing artwork media could not be deleted' });
      }
    } else {
      return res.status(400).json({ message: 'Artwork media not found' });
    }
  } catch (err) {
    next(err, res);
  }
}; */

module.exports = {
  postProfileImage,
  /*   postArtworkCover, */
  /*   updateArtworkCover, */
  postArtworkMedia,
  putArtworkMedia,
  /*   updateArtworkMedia */
};
