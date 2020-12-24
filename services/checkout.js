import createError from "http-errors";
import Artwork from "../models/artwork.js";

// $CHECKED NOT USED (Can be safely removed)
export const fetchCheckoutArtwork = async ({
  userId,
  artworkId,
  session = null,
}) => {
  const foundArtwork = await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  }).populate(
    "current",
    "_id cover created title personal type license availability description use commercial height width"
  );
  if (foundArtwork) {
    res.json({
      artwork: foundArtwork,
    });
  } else {
    throw createError(400, "Artwork not found");
  }
};
