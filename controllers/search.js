import mongoose from 'mongoose';
import { getArtworkResults, getUserResults } from '../services/search.js';

const getResults = async (req, res, next) => {
  try {
    const { query, type, cursor, ceiling } = req.query;
    const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
    const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;

    let foundResults = [];
    let foundType = null;
    if (type === 'artwork') {
      foundResults = await getArtworkResults({ query, skip, limit });
      foundType = 'artwork';
    } else if (type === 'users') {
      foundResults = await getUserResults({ query, skip, limit });
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
