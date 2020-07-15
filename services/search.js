import mongoose from 'mongoose';
import User from '../models/user.js';
import Version from '../models/version.js';

export const fetchArtworkResults = async ({
  searchQuery,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await Version.fuzzySearch(searchQuery, undefined, {
    skip: dataSkip,
    limit: dataLimit,
  }).deepPopulate('artwork.owner');
};

export const fetchUserResults = async ({
  searchQuery,
  dataSkip,
  dataLimit,
  session = null,
}) => {
  return await User.fuzzySearch(searchQuery, undefined, {
    skip: dataSkip,
    limit: dataLimit,
  }).deepPopulate('artwork.owner');
};
