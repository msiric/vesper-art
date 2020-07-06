import mongoose from 'mongoose';
import { fetchUserById } from '../services/user.js';
import {
  verifyDimensions,
  deleteFileLocally,
  userS3Upload,
  artworkS3Upload,
} from '../services/upload.js';
import createError from 'http-errors';

// needs transaction (done)
const postProfileImage = async ({ path, filename }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ path, type: 'user' });
  if (verifiedInput.valid) {
    const { media } = await userS3Upload({ path, filename });
    deleteFileLocally({ path });
    return {
      userMedia: media,
      userDimensions: verifiedInput.dimensions,
    };
  }
  deleteFileLocally({ path });
  throw createError(400, 'Artwork dimensions are not valid');
};

const postArtworkMedia = async ({ path, filename }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ path, type: 'artwork' });
  if (verifiedInput.valid) {
    const { cover, media } = await artworkS3Upload({ path, filename });
    deleteFileLocally({ path });
    return {
      artworkCover: cover,
      artworkMedia: media,
      artworkDimensions: verifiedInput.dimensions,
    };
  }
  deleteFileLocally({ path });
  throw createError(400, 'Artwork dimensions are not valid');
};

const putArtworkMedia = async ({ path, filename }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ path, type: 'artwork' });
  if (verifiedInput.valid) {
    const { cover, media } = await artworkS3Upload({ path, filename });
    deleteFileLocally({ path });
    return {
      artworkCover: cover,
      artworkMedia: media,
      artworkDimensions: verifiedInput.dimensions,
    };
  }
  deleteFileLocally({ path });
  throw createError(400, 'Artwork dimensions are not valid');
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
        Bucket: process.env.S3_BUCKET,
        Key: filePath
      };
      const deletedImage = await s3.deleteObject(params).promise();
      if (deletedImage) {
        foundArtwork.cover = req.file.location;
        const savedArtwork = await foundArtwork.save();
        if (savedArtwork) {
          return res.json({ imageUrl: req.file.location });
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
    return res.json({ imageUrl: req.file.location });
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
        Bucket: process.env.S3_BUCKET,
        Key: filePath
      };
      const deletedImage = await s3.deleteObject(params).promise();
      if (deletedImage) {
        foundArtwork.media = req.file.location;
        const savedArtwork = await foundArtwork.save();
        if (savedArtwork) {
          return res.json({ imageUrl: req.file.location });
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

export default {
  postProfileImage,
  /*   postArtworkCover, */
  /*   updateArtworkCover, */
  postArtworkMedia,
  putArtworkMedia,
  /*   updateArtworkMedia */
};
