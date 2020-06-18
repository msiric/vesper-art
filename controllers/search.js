import mongoose from 'mongoose';
import { formatParams } from '../utils/helpers.js';
import { fetchArtworkResults, fetchUserResults } from '../services/search.js';

const getResults = async ({ query, type, cursor, ceiling }) => {
  const { skip, limit } = formatParams({ cursor, ceiling });
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
