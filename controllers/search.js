import {
  fetchArtworkResults,
  fetchUserResults,
} from "../services/postgres/search.js";
import { formatParams, sanitizeData } from "../utils/helpers.js";
import searchValidator from "../validation/search.js";

export const getResults = async ({
  searchQuery,
  searchType,
  dataCursor,
  dataCeiling,
}) => {
  const { error } = searchValidator(sanitizeData({ searchQuery, searchType }));
  const { dataSkip, dataLimit } = formatParams({ dataCursor, dataCeiling });
  let foundResults = [];
  let foundType = null;
  if (searchType === "artwork") {
    foundResults = await fetchArtworkResults({
      searchQuery,
      dataSkip,
      dataLimit,
    });
    foundType = "artwork";
  } else if (searchType === "users") {
    foundResults = await fetchUserResults({ searchQuery, dataSkip, dataLimit });
    foundType = "users";
  }
  return {
    searchData: foundResults,
    searchDisplay: foundType,
  };
};
