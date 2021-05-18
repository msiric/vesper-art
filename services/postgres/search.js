import { Artwork } from "../../entities/Artwork";
import { User } from "../../entities/User";

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
      "version.title @@ plainto_tsquery(:query) AND artwork.active = :active",
      {
        query: formattedQuery,
        active: true,
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
    .where("user.name @@ plainto_tsquery(:query) AND user.active = :active", {
      query: formattedQuery,
      active: true,
    })
    .orderBy("ts_rank(to_tsvector(user.name), plainto_tsquery(:query))", "DESC")
    .getMany();
  return foundUsers;
};
