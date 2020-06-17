import mongoose from 'mongoose';
import { fetchArtworkResults, fetchUserResults } from '../services/search.js';

const getResults = async ({ query, type, cursor, ceiling }) => {
  const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
  const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
  let foundResults = [];
  let foundType = null;
  if (type === 'artwork') {
    foundResults = await fetchArtworkResults({ query, skip, limit });
    foundType = 'artwork';
  } else if (type === 'users') {
    foundResults = await fetchUserResults({ query, skip, limit });
    foundType = 'users';
  }
  return {
    searchResults: foundResults,
    searchType: foundType,
  };
};

export default {
  getResults,
};
