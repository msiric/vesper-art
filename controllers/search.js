import mongoose from 'mongoose';
import { formatParams, sanitizeData } from '../utils/helpers.js';
import { fetchArtworkResults, fetchUserResults } from '../services/search.js';
import searchValidator from '../utils/validation/search.js';
import createError from 'http-errors';

const getResults = async ({ query, type, cursor, ceiling }) => {
  const { error } = searchValidator(
    sanitizeData({ searchQuery: query, searchType: type })
  );
  if (error) throw createError(400, error);
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
