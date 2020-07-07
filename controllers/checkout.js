import mongoose from "mongoose";
import { fetchArtworkDetails } from "../services/artwork.js";
import { fetchUserDiscount } from "../services/user.js";
import createError from "http-errors";

export const getCheckout = async ({ userId, artworkId }) => {
  const foundArtwork = await fetchArtworkDetails({ artworkId });
  if (foundArtwork) {
    const foundUser = await fetchUserDiscount({ userId });
    return {
      artwork: foundArtwork,
      discount: foundUser.discount,
    };
  }
  throw createError(400, "Artwork not found");
};
