import { Artwork } from "../entities/Artwork";
import { Avatar } from "../entities/Avatar";
import { Cover } from "../entities/Cover";
import { Media } from "../entities/Media";
import { User } from "../entities/User";
import { Version } from "../entities/Version";
import { connectToDatabase } from "../utils/database";
import { entities } from "./entities";

export const seedDatabase = async () => {
  const connection = await connectToDatabase();
  for (let user of entities) {
    // user
    const { userId, avatarId } = generateUuids({
      userId: null,
      avatarId: null,
    });
    const userPassword = await argon2.hash(user.data.password);
    user.data.id = userId;
    user.data.password = userPassword;
    // avatar
    user.avatar.data.id = avatarId;
    user.avatar.data.ownerId = userId;
    // $TODO - handle avatar upload
    // end of todo
    for (let artwork of user.artwork) {
      // artwork
      const { artworkId, versionId, mediaId, coverId } = generateUuids({
        artworkId: null,
        versionId: null,
        mediaId: null,
        coverId: null,
      });
      artwork.data.id = artworkId;
      artwork.data.ownerId = userId;
      artwork.data.currentId = versionId;
      // version
      artwork.version.data.id = versionId;
      artwork.version.data.artworkId = artworkId;
      artwork.version.data.coverId = coverId;
      artwork.version.data.mediaId = mediaId;
      // media
      artwork.version.media.data.id = mediaId;
      // $TODO - handle media upload
      // end of todo
      // cover
      artwork.version.cover.data.id = coverId;
      // $TODO - handle cover upload
      // end of todo
      await Promise.all([
        connection
          .createQueryBuilder()
          .insert()
          .into(Cover)
          .values(artwork.version.cover.data)
          .execute(),
        connection
          .createQueryBuilder()
          .insert()
          .into(Media)
          .values(artwork.version.media.data)
          .execute(),
      ]);
      await connection
        .createQueryBuilder()
        .insert()
        .into(Version)
        .values(artwork.version.data)
        .execute();
      await connection
        .createQueryBuilder()
        .insert()
        .into(Artwork)
        .values(artwork.data)
        .execute();
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(Avatar)
      .values(user.avatar.data)
      .execute();
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user.data)
      .execute();
  }
};
