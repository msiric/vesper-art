import mongoose from 'mongoose';
import User from '../models/user.js';
import Version from '../models/version.js';

export const getArtworkResults = async ({
  query,
  skip,
  limit,
  session = null,
}) => {
  return await Version.fuzzySearch(query, undefined, {
    skip,
    limit,
  }).deepPopulate('artwork.owner');
};

export const getUserResults = async ({
  query,
  skip,
  limit,
  session = null,
}) => {
  return await User.fuzzySearch(query, undefined, {
    skip,
    limit,
  }).deepPopulate('artwork.owner');
};
