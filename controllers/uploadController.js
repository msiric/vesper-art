const aws = require('aws-sdk');
const User = require('../models/user');
const Artwork = require('../models/artwork');
const upload = require('../services/multer');

const profilePhotoUpload = upload.profilePhotoUpload;
const artworkCoverUpload = upload.artworkCoverUpload;
const artworkCoverEdit = upload.artworkCoverEdit;

const profilePhotoSingleUpload = profilePhotoUpload.single('image');
const artworkCoverSingleUpload = artworkCoverUpload.single('image');
const artworkCoverSingleEdit = artworkCoverEdit.single('image');

const postProfileImage = async (req, res, next) => {
  try {
    const uploadedImage = await profilePhotoSingleUpload(req, res);
    if (uploadedImage) {
      const foundUser = await User.findOne({ _id: req.user._id });
      if (foundUser) {
        const fileName = foundUser.photo.split('/').slice(-1)[0];
        const folderName = 'profilePhotos/';
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: 'vesper-testing',
          Key: filePath
        };
        const deletedImage = await s3.deleteObject(params);
        if (deletedImage) {
          foundUser.photo = req.file.location;
          const savedUser = await foundUser.save();
          if (savedUser) {
            return res.status(200).json({ imageUrl: req.file.location });
          } else {
            return res
              .status(400)
              .json({ message: 'Could not update profile image' });
          }
        } else {
          return res
            .status(400)
            .json({ message: 'Could not delete existing image' });
        }
      } else {
        return res.status(400).json({ message: 'User not found' });
      }
    } else {
      return res.status(422).send({
        errors: [{ title: 'Image upload error', detail: err.message }]
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const postArtworkCover = async (req, res, next) => {
  try {
    const uploadedImage = await artworkCoverSingleUpload(req, res);
    if (uploadedImage) {
      return res.status(200).json({ imageUrl: req.file.location });
    } else {
      return res.status(422).send({
        errors: [{ title: 'Image upload error', detail: err.message }]
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateArtworkCover = async (req, res, next) => {
  try {
    const artworkId = req.params.id;
    const uploadedImage = await artworkCoverSingleEdit(req, res);
    if (uploadedImage) {
      const foundArtwork = await Artwork.findOne({ _id: artworkId });
      if (foundArtwork && foundArtwork.cover) {
        const fileName = foundArtwork.cover.split('/').slice(-1)[0];
        const folderName = 'artworkCovers/';
        const filePath = folderName + fileName;
        const s3 = new aws.S3();
        const params = {
          Bucket: 'vesper-testing',
          Key: filePath
        };
        const deletedImage = await s3.deleteObject(params);
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
    } else {
      return res.status(422).send({
        errors: [{ title: 'Image upload error', detail: err.message }]
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  postProfileImage,
  postArtworkCover,
  updateArtworkCover
};
