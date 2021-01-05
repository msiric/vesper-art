import User from "../../models/user.js";
import Version from "../../models/version.js";

export const fetchArtworkResults = async ({
  searchQuery,
  dataSkip,
  dataLimit,
  connection,
}) => {
  return await Version.fuzzySearch(searchQuery).deepPopulate("artwork.owner");
};

export const fetchUserResults = async ({
  searchQuery,
  dataSkip,
  dataLimit,
  connection,
}) => {
  return await User.fuzzySearch(searchQuery).deepPopulate("artwork.owner");
};
