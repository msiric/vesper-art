import createError from "http-errors";
import {
  artworkS3Upload,
  deleteFileLocally,
  userS3Upload,
  verifyDimensions,
} from "../services/upload.js";

// $TODO Instead of two separate routes/controllers, add middleware for file upload

// needs transaction (done)
export const postProfileImage = async ({ filePath, fileName }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ filePath, type: "user" });
  if (verifiedInput.valid) {
    const { media, dominant } = await userS3Upload({ filePath, fileName });
    deleteFileLocally({ filePath });
    return {
      userMedia: media,
      userDominant: dominant,
      userDimensions: verifiedInput.dimensions,
    };
  }
  deleteFileLocally({ filePath });
  throw createError(400, "Artwork dimensions are not valid");
};

export const postArtworkMedia = async ({ filePath, fileName }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ filePath, type: "artwork" });
  if (verifiedInput.valid) {
    const { cover, media, dominant } = await artworkS3Upload({
      filePath,
      fileName,
    });
    deleteFileLocally({ filePath });
    return {
      artworkCover: cover,
      artworkMedia: media,
      artworkDominant: dominant,
      artworkDimensions: verifiedInput.dimensions,
    };
  }
  deleteFileLocally({ filePath });
  throw createError(400, "Artwork dimensions are not valid");
};

export const putArtworkMedia = async ({ filePath, fileName }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ filePath, type: "artwork" });
  if (verifiedInput.valid) {
    const { cover, media, dominant } = await artworkS3Upload({
      filePath,
      fileName,
    });
    deleteFileLocally({ filePath });
    return {
      artworkCover: cover,
      artworkMedia: media,
      artworkDominant: dominant,
      artworkDimensions: verifiedInput.dimensions,
    };
  }
  deleteFileLocally({ filePath });
  throw createError(400, "Artwork dimensions are not valid");
};
