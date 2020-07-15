import mongoose from 'mongoose';
import { fetchUserById } from '../services/user.js';
import {
  verifyDimensions,
  deleteFileLocally,
  userS3Upload,
  artworkS3Upload,
} from '../services/upload.js';
import createError from 'http-errors';

// $TODO Instead of two separate routes/controllers, add middleware for file upload

// needs transaction (done)
export const postProfileImage = async ({ filePath, fileName }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ filePath, type: 'user' });
  if (verifiedInput.valid) {
    const { media } = await userS3Upload({ filePath, fileName });
    deleteFileLocally({ filePath });
    return {
      userMedia: media,
      userDimensions: verifiedInput.dimensions,
    };
  }
  deleteFileLocally({ filePath });
  throw createError(400, 'Artwork dimensions are not valid');
};

export const postArtworkMedia = async ({ filePath, fileName }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ filePath, type: 'artwork' });
  if (verifiedInput.valid) {
    const { cover, media } = await artworkS3Upload({ filePath, fileName });
    deleteFileLocally({ filePath });
    return {
      artworkCover: cover,
      artworkMedia: media,
      artworkDimensions: verifiedInput.dimensions,
    };
  }
  deleteFileLocally({ filePath });
  throw createError(400, 'Artwork dimensions are not valid');
};

export const putArtworkMedia = async ({ filePath, fileName }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ filePath, type: 'artwork' });
  if (verifiedInput.valid) {
    const { cover, media } = await artworkS3Upload({ filePath, fileName });
    deleteFileLocally({ filePath });
    return {
      artworkCover: cover,
      artworkMedia: media,
      artworkDimensions: verifiedInput.dimensions,
    };
  }
  deleteFileLocally({ filePath });
  throw createError(400, 'Artwork dimensions are not valid');
};
