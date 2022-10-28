import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { upload } from "../../common/constants";
import { uploadS3Object } from "../../lib/s3";
import {
  connectToDatabase,
  evaluateTransaction,
  releaseTransaction,
  rollbackTransaction,
} from "../../utils/database";
import { entities } from "./entities";

const dirname = path.resolve();

const MEDIA_LOCATION = path.resolve(path.join(dirname, "previews/media"));
const AVATAR_LOCATION = path.resolve(path.join(dirname, "previews/avatars"));
const SUPPORTED_MIMETYPES = {
  jpg: { type: "jpeg", mimeType: "image/jpeg" },
  jpeg: { type: "jpeg", mimeType: "image/jpeg" },
  png: { type: "png", mimeType: "image/png" },
};

const seedS3 = async () => {
  try {
    console.log("Reading artwork directory...");
    const artwork = await fs.readdir(MEDIA_LOCATION);
    console.log("Uploading artwork to S3...");
    for (let file of artwork) {
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
    console.log("S3 artwork seeded successfully");
    console.log("Reading avatar directory...");
    const avatars = await fs.readdir(AVATAR_LOCATION);
    console.log("Uploading avatars to S3...");
    for (let file of avatars) {
      const fileName = file;
      const filePath = `${AVATAR_LOCATION}/${file}`;
      const fileType = SUPPORTED_MIMETYPES[filePath.split(".").pop()].type;
      const mimeType = SUPPORTED_MIMETYPES[filePath.split(".").pop()].mimeType;
      const fileMedia = await sharp(filePath)[fileType]().toBuffer();
      await uploadS3Object({
        fileContent: fileMedia,
        folderName: "userMedia",
        fileName,
        mimeType,
      });
    }
    console.log("S3 avatars seeded successfully");
    console.log("S3 media seeded successfully");
  } catch (err) {
    console.log("Failed to upload media to S3: ", err);
  }
};

(async () => {
  const connection = await connectToDatabase();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await connection.synchronize(true);
    for (let entity in entities) {
      for (let row of entities[entity]) {
        await connection
          .createQueryBuilder()
          .insert()
          .into(entity)
          .values(row)
          .execute();
      }
    }
    await seedS3();
    await evaluateTransaction(queryRunner);
    console.log("Test database seeded successfully");
  } catch (err) {
    console.log("Failed seeding the test database: ", err);
    await rollbackTransaction(queryRunner);
  } finally {
    await releaseTransaction(queryRunner);
  }
})();
