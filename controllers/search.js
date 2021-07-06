import createError from "http-errors";
import {
  fetchArtworkResults,
  fetchUserResults,
} from "../services/postgres/search";
import {} from "../utils/helpers";
import { errors } from "../utils/statuses";
import searchValidator from "../validation/search";

export const getResults = async ({
  searchQuery,
  searchType,
  cursor,
  limit,
  connection,
}) => {
  const { error } = searchValidator({ searchQuery, searchType });

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
  } else {
    throw createError(...formatError(errors.searchTypeInvalid));
  }
  return {
    searchData: foundResults,
    searchDisplay: foundType,
  };
};
