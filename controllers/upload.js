import mongoose from "mongoose";
import { fetchUserById } from "../services/user.js";
import {
  verifyDimensions,
  deleteFileLocally,
  userS3Upload,
  artworkS3Upload,
} from "../services/upload.js";
import createError from "http-errors";

// needs transaction (done)
export const postProfileImage = async ({ path, filename }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ path, type: "user" });
  if (verifiedInput.valid) {
    const { media } = await userS3Upload({ path, filename });
    deleteFileLocally({ path });
    return {
      userMedia: media,
      userDimensions: verifiedInput.dimensions,
    };
  }
  deleteFileLocally({ path });
  throw createError(400, "Artwork dimensions are not valid");
};

export const postArtworkMedia = async ({ path, filename }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ path, type: "artwork" });
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
  throw createError(400, "Artwork dimensions are not valid");
};

export const putArtworkMedia = async ({ path, filename }) => {
  // $TODO Verify that the user uploading the photo is valid and check its id
  const verifiedInput = await verifyDimensions({ path, type: "artwork" });
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
  throw createError(400, "Artwork dimensions are not valid");
};
