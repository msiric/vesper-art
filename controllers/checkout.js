import createError from 'http-errors';
import { fetchArtworkDetails } from '../services/artwork.js';

export const getCheckout = async ({ userId, artworkId }) => {
  const foundArtwork = await fetchArtworkDetails({ artworkId });
  if (foundArtwork) {
    return {
      artwork: foundArtwork,
    };
  }
  throw createError(400, 'Artwork not found');
};
