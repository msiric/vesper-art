import mongoose from 'mongoose';
import User from '../models/user.js';
import Version from '../models/version.js';
import createError from 'http-errors';

export const getArtworkResults = async ({ query, skip, limit }) => {
  return await Version.fuzzySearch(query, undefined, {
    skip,
    limit,
  }).deepPopulate('artwork.owner');
};

export const getUserResults = async ({}) => {
  return await User.fuzzySearch(query, undefined, {
    skip,
    limit,
  }).deepPopulate('artwork.owner');
};
