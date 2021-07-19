import { Artwork, ArtworkVisibility } from "../../entities/Artwork";
import { Review } from "../../entities/Review";
import { User } from "../../entities/User";
import { calculateRating } from "../../utils/helpers";

const VISIBILITY_STATUS = ArtworkVisibility.visible;

// $TODO version visible
// $TODO active to const
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
    .leftJoinAndSelect("owner.avatar", "avatar")
    .where(
      "version.title @@ plainto_tsquery(:query) AND artwork.active = :active AND artwork.visibility = :visibility",
      {
        query: formattedQuery,
        active: true,
        visibility: VISIBILITY_STATUS,
      }
    )
    .orderBy(
      "ts_rank(to_tsvector(version.title), plainto_tsquery(:query))",
      "DESC"
    )
    .getMany();
  // const foundArtworkTest = await connection
  //   .getRepository(Artwork)
  //   .createQueryBuilder("artwork")
  //   .leftJoinAndSelect("artwork.current", "version")
  //   .where(
  //     `to_tsvector('simple',version.title) @@ to_tsquery('simple', :query) AND artwork.active = :active`,
  //     { query: `${formattedQuery}:*`, active: true }
  //   )
  //   .getMany();
  return foundArtwork;
};

// $TODO active to const
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
    .where("user.name @@ plainto_tsquery(:query) AND user.active = :active", {
      query: formattedQuery,
      active: true,
    })
    .orderBy("ts_rank(to_tsvector(user.name), plainto_tsquery(:query))", "DESC")
    .getMany();
  for (let user of foundUsers) {
    user.rating = calculateRating({
      active: user.active,
      reviews: user.reviews,
    });
  }
  return foundUsers;
};
