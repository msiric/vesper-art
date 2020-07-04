import mongoose from 'mongoose';
import { fetchUserById } from '../services/user.js';
import { deleteS3Object } from '../utils/helpers.js';
import {
  verifyDimensions,
  deleteFileLocally,
  artworkS3Upload,
} from '../services/upload.js';
import createError from 'http-errors';

// needs transaction (done)
const postProfileImage = async ({ userId, session, location }) => {
  const foundUser = await fetchUserById({
    userId,
    session,
  });
  if (foundUser) {
    await deleteS3Object({ link: foundUser.photo, folder: 'profilePhotos/' });
    foundUser.photo = location;
    await foundUser.save({ session });
    return { imageUrl: location };
  }
  throw createError(400, 'User not found');
};

const postArtworkMedia = async ({ path, filename }) => {
  const verifiedInput = await verifyDimensions({ path });
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

const putArtworkMedia = async ({ cover, media }) => {
  return {
    artworkCover: cover,
    artworkMedia: media,
  };
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
        Bucket: 'vesper-testing',
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
