import mongoose from 'mongoose';
import User from '../models/user.js';
import Version from '../models/version.js';
import createError from 'http-errors';

export const getResults = async ({ query, type, cursor, ceiling }) => {
  const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
  const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
  return type === 'artwork'
    ? await Version.fuzzySearch(query, undefined, {
        skip,
        limit,
      }).deepPopulate('artwork.owner')
    : type === 'users'
    ? await User.fuzzySearch(query, undefined, {
        skip,
        limit,
      })
    : null;
};
