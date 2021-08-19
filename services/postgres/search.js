import { Artwork } from "../../entities/Artwork";
import { Review } from "../../entities/Review";
import { User } from "../../entities/User";
import { calculateRating } from "../../utils/helpers";
import {
  ARTWORK_SELECTION,
  AVATAR_SELECTION,
  COVER_SELECTION,
  REVIEW_SELECTION,
  USER_SELECTION,
  VERSION_SELECTION,
} from "../../utils/selectors";

export const fetchArtworkResults = async ({
  searchQuery,
  cursor,
  limit,
  connection,
}) => {
  const formattedQuery = searchQuery.trim().replace(/ /g, " & ");
  const foundArtwork = await connection
    .getRepository(Artwork)
    .createQueryBuilder("artwork")
    .leftJoinAndSelect("artwork.current", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("artwork.owner", "owner")
    .select([
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("owner"),
    ])
    .where(
      "version.title @@ plainto_tsquery(:query) AND artwork.active = :active AND artwork.visibility = :visibility",
      {
        query: formattedQuery,
        active: ARTWORK_SELECTION.ACTIVE_STATUS,
        visibility: ARTWORK_SELECTION.VISIBILITY_STATUS,
      }
    )
    .orderBy(
      "ts_rank(to_tsvector(version.title), plainto_tsquery(:query))",
      "DESC"
    )
    .getMany();

  return foundArtwork;
};

export const fetchUserResults = async ({
  searchQuery,
  cursor,
  limit,
  connection,
}) => {
  const formattedQuery = searchQuery.trim().replace(/ /g, " & ");
  const foundUsers = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.avatar", "avatar")
    .leftJoinAndMapMany(
      "user.reviews",
      Review,
      "review",
      "review.revieweeId = user.id"
    )
    .select([
      ...USER_SELECTION["ESSENTIAL_INFO"](),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where("user.name @@ plainto_tsquery(:query) AND user.active = :active", {
      query: formattedQuery,
      active: USER_SELECTION.ACTIVE_STATUS,
    })
    .orderBy("ts_rank(to_tsvector(user.name), plainto_tsquery(:query))", "DESC")
    .getMany();
  // $TODO treba ovo odradit ranije
  for (let user of foundUsers) {
    user.rating = calculateRating({
      active: user.active,
      reviews: user.reviews,
    });
  }
  return foundUsers;
};
