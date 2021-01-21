import User from "../../models/user.js";
import Version from "../../models/version.js";

export const fetchArtworkResults = async ({
  searchQuery,
  cursor,
  limit,
  connection,
}) => {
  return await Version.fuzzySearch(searchQuery).deepPopulate("artwork.owner");
};

export const fetchUserResults = async ({
  searchQuery,
  cursor,
  limit,
  connection,
}) => {
  return await User.fuzzySearch(searchQuery).deepPopulate("artwork.owner");
};
