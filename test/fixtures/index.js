import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { upload } from "../../common/constants";
import { isObjectEmpty } from "../../common/helpers";
import { User } from "../../entities/User";
import { uploadS3Object } from "../../lib/s3";
import {
  connectToDatabase,
  evaluateTransaction,
  releaseTransaction,
  rollbackTransaction,
} from "../../utils/database";
import { USER_SELECTION } from "../../utils/selectors";
import { entities, validUsers } from "./entities";

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
      await uploadS3Object({
        fileContent: fileCover,
        folderName: "artworkCovers",
        fileName,
        mimeType,
      });
      await uploadS3Object({
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
        name: validUsers.seller.name,
        email: validUsers.seller.email,
      })
      .getOne();
    if (isObjectEmpty(foundUser)) {
      await connection.synchronize(true);
      for (let item in entities) {
        await connection
          .createQueryBuilder()
          .insert()
          .into(item)
          .values(entities[item])
          .execute();
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
