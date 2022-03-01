import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { upload } from "../common/constants";
import { isObjectEmpty } from "../common/helpers";
import { Artwork } from "../entities/Artwork";
import { Avatar } from "../entities/Avatar";
import { Cover } from "../entities/Cover";
import { Media } from "../entities/Media";
import { User } from "../entities/User";
import { Version } from "../entities/Version";
import { uploadS3Object } from "../lib/s3";
import {
  connectToDatabase,
  evaluateTransaction,
  releaseTransaction,
  rollbackTransaction,
  USER_SELECTION,
} from "../utils/database";
import { generateUuids, hashString } from "../utils/helpers";
import { entities } from "./entities";

const dirname = path.resolve();

const MEDIA_LOCATION = path.resolve(path.join(dirname, "previews/media"));
const AVATAR_LOCATION = path.resolve(path.join(dirname, "previews/avatar"));
const SUPPORTED_MIMETYPES = {
  jpg: { type: "jpeg", mimeType: "image/jpeg" },
  jpeg: { type: "jpeg", mimeType: "image/jpeg" },
  png: { type: "png", mimeType: "image/png" },
};

const seedS3 = async () => {
  try {
    const files = await fs.readdir(MEDIA_LOCATION);
    for (let file of files) {
      const fileName = file;
      const filePath = `${MEDIA_LOCATION}/${file}`;
      const fileType = SUPPORTED_MIMETYPES[filePath.split(".").pop()].type;
      const mimeType = SUPPORTED_MIMETYPES[filePath.split(".").pop()].mimeType;
      const fileMedia = await sharp(filePath)[fileType]().toBuffer();
      const fileCover = await sharp(filePath)
        .resize(upload.artwork.fileTransform.width)
        [fileType]({ quality: 100 })
        .toBuffer();
      const {
        dominant: { r, g, b },
      } = await sharp(filePath).stats();
      const coverLocation = await uploadS3Object({
        fileContent: fileCover,
        folderName: "artworkCovers",
        fileName,
        mimeType,
      });
      const mediaLocation = await uploadS3Object({
        fileContent: fileMedia,
        folderName: "artworkMedia",
        fileName,
        mimeType,
      });
    }
  } catch (err) {
    console.log("err s3", err);
  }
};

(async () => {
  const connection = await connectToDatabase();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const foundUser = await connection
      .getRepository(User)
      .createQueryBuilder("user")
      .select([...USER_SELECTION["STRIPPED_INFO"]()])
      .where("user.name = :name AND user.email = :email", {
        name: entities[0].data.name,
        email: entities[0].data.email,
      })
      .getOne();
    if (isObjectEmpty(foundUser)) {
      await connection.synchronize(true);
      for (let user of entities) {
        // user
        const { userId, avatarId } = generateUuids({
          userId: null,
          avatarId: null,
        });
        const userPassword = await hashString(user.data.password);
        user.data.id = userId;
        user.data.avatarId = avatarId;
        user.data.password = userPassword;
        // avatar
        user.avatar.data.id = avatarId;
        user.avatar.data.ownerId = userId;
        // $TODO - handle avatar upload
        // end of todo

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
      }
    }
    await seedS3();
    await evaluateTransaction(queryRunner);
    console.log("done");
  } catch (err) {
    console.log("err", err);
    await rollbackTransaction(queryRunner);
  } finally {
    await releaseTransaction(queryRunner);
  }
})();
