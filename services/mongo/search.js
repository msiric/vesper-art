import User from "../../models/user.js";
import Version from "../../models/version.js";

export const fetchArtworkResults = async ({
  searchQuery,
  cursor,
  limit,
  session = null,
}) => {
  return await Version.fuzzySearch(searchQuery)
    .deepPopulate("artwork.owner")
    .session(session);
};

export const fetchUserResults = async ({
  searchQuery,
  cursor,
  limit,
  session = null,
}) => {
  return await User.fuzzySearch(searchQuery)
    .deepPopulate("artwork.owner")
    .session(session);
};
