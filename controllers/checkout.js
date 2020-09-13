import createError from 'http-errors';
import { fetchVersionDetails } from '../services/artwork.js';

export const getCheckout = async ({ userId, versionId }) => {
  const foundVersion = await fetchVersionDetails({ versionId });
  if (foundVersion && foundVersion.artwork.active) {
    return {
      version: foundVersion,
    };
  }
  throw createError(400, 'Artwork not found');
};
