import mongoose from 'mongoose';
import { formatParams, sanitizeData } from '../utils/helpers.js';
import { fetchArtworkResults, fetchUserResults } from '../services/search.js';
import searchValidator from '../validation/search.js';
import createError from 'http-errors';

export const getResults = async ({
  searchQuery,
  searchType,
  dataCursor,
  dataCeiling,
}) => {
  const { error } = searchValidator(sanitizeData({ searchQuery, searchType }));
  if (error) throw createError(400, error);
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  let foundResults = [];
  let foundType = null;
  if (searchType === 'artwork') {
    foundResults = await fetchArtworkResults({
      searchQuery,
      dataSkip,
      dataLimit,
    });
    foundType = 'artwork';
  } else if (searchType === 'users') {
    foundResults = await fetchUserResults({ searchQuery, dataSkip, dataLimit });
    foundType = 'users';
  }
  return {
    searchData: foundResults,
    searchDisplay: foundType,
  };
};
