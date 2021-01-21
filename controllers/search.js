import {
  fetchArtworkResults,
  fetchUserResults,
} from "../services/postgres/search.js";
import { sanitizeData } from "../utils/helpers.js";
import searchValidator from "../validation/search.js";

export const getResults = async ({
  searchQuery,
  searchType,
  cursor,
  limit,
  connection,
}) => {
  const { error } = searchValidator(sanitizeData({ searchQuery, searchType }));

  let foundResults = [];
  let foundType = null;
  if (searchType === "artwork") {
    foundResults = await fetchArtworkResults({
      searchQuery,
      cursor,
      limit,
      connection,
    });
    foundType = "artwork";
  } else if (searchType === "users") {
    foundResults = await fetchUserResults({
      searchQuery,
      cursor,
      limit,
      connection,
    });
    foundType = "users";
  }
  return {
    searchData: foundResults,
    searchDisplay: foundType,
  };
};
