import { searchValidation } from "../common/validation";
import { fetchArtworkResults, fetchUserResults } from "../services/search";

export const getResults = async ({
  searchQuery,
  searchType,
  cursor,
  limit,
  connection,
}) => {
  await searchValidation.validate({ searchQuery, searchType });
  const foundResults =
    searchType === "artwork"
      ? await fetchArtworkResults({
          searchQuery,
          cursor,
          limit,
          connection,
        })
      : await fetchUserResults({
          searchQuery,
          cursor,
          limit,
          connection,
        });
  return {
    searchData: foundResults,
    searchDisplay: searchType,
  };
};
