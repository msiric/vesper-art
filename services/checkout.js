import mongoose from 'mongoose';
import Artwork from '../models/artwork.js';
import User from '../models/user.js';
import createError from 'http-errors';

export const fetchCheckoutArtwork = async ({
  userId,
  artworkId,
  session = null,
}) => {
  const foundArtwork = await Artwork.findOne({
    $and: [{ _id: artworkId }, { active: true }],
  }).populate(
    'current',
    '_id cover created title personal type license availability description use commercial height width'
  );
  if (foundArtwork) {
    const foundUser = await User.findOne({
      $and: [{ _id: userId }, { active: true }],
    }).populate('discount');
    res.json({
      artwork: foundArtwork,
      discount: foundUser.discount,
    });
  } else {
    throw createError(400, 'Artwork not found');
  }
};
