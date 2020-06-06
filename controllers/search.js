import mongoose from 'mongoose';
import User from '../models/user.js';
import Version from '../models/version.js';
import createError from 'http-errors';

const getResults = async (req, res, next) => {
  try {
    const { query, type, cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;

    let foundResults = [];
    let foundType = null;
    if (type === 'artwork') {
      foundResults = await Version.fuzzySearch(query, undefined, {
        skip,
        limit,
      }).deepPopulate('artwork.owner');
      foundType = 'artwork';
    } else if (type === 'users') {
      foundResults = await User.fuzzySearch(query, undefined, {
        skip,
        limit,
      });
      foundType = 'users';
    }
    return res.json({
      searchResults: foundResults,
      searchType: foundType,
    });
  } catch (err) {
    next(err, res);
  }
};

export default {
  getResults,
};
