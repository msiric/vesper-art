const mongoose = require('mongoose');
const aws = require('aws-sdk');
const User = require('../models/user');
const Artwork = require('../models/artwork');

// needs transaction (done)
const postProfileImage = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundUser = await User.findOne({ _id: req.user._id }).session(
      session
    );
    if (foundUser) {
      const folderName = 'profilePhotos/';
      const fileName = foundUser.photo.split('/').slice(-1)[0];
      const filePath = folderName + fileName;
      const s3 = new aws.S3();
      const params = {
        Bucket: 'vesper-testing',
        Key: filePath
      };
      const deletedImage = await s3.deleteObject(params).promise();
      if (deletedImage) {
        foundUser.photo = req.file.location;
        const savedUser = await foundUser.save({ session });
        if (savedUser) {
          await session.commitTransaction();
          return res.status(200).json({ imageUrl: req.file.location });
        } else {
          await session.abortTransaction();
          return res
            .status(400)
            .json({ message: 'Could not update profile image' });
        }
      } else {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: 'Could not delete existing image' });
      }
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'User not found' });
    }
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

const postArtworkMedia = async (req, res, next) => {
  try {
    return res.status(200).json({
      coverUrl: req.file.transforms[0].location,
      originalUrl: req.file.transforms[1].location
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const putArtworkMedia = async (req, res, next) => {
  try {
    return res.status(200).json({
      coverUrl: req.file.transforms[0].location,
      originalUrl: req.file.transforms[1].location
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
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
    return res.status(500).json({ message: 'Internal server error' });
  }
}; */

/* const postArtworkMedia = async (req, res, next) => {
  try {
    console.log(req.file);
    return res.status(200).json({ imageUrl: req.file.location });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
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
    return res.status(500).json({ message: 'Internal server error' });
  }
}; */

module.exports = {
  postProfileImage,
  /*   postArtworkCover, */
  /*   updateArtworkCover, */
  postArtworkMedia,
  putArtworkMedia
  /*   updateArtworkMedia */
};
