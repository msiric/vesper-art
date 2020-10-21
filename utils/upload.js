import aws from "aws-sdk";
import fs from "fs";
import createError from "http-errors";
import imageSize from "image-size";
import sharp from "sharp";
import { upload } from "../config/constants.js";

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ID,
  region: process.env.S3_REGION,
});

export const userS3Upload = async ({ filePath, fileName }) => {
  const sharpMedia = await sharp(filePath).toBuffer();
  const {
    dominant: { r, g, b },
  } = await sharp(filePath).stats();
  const userDominant = `${r}, ${g}, ${b}`;
  const userMediaPath = await uploadS3Object({
    fileContent: sharpMedia,
    folderName: "userMedia",
    fileName,
  });
  return { cover: "", media: userMediaPath, dominant: userDominant };
};

export const artworkS3Upload = async ({ filePath, fileName }) => {
  const sharpMedia = await sharp(filePath).toBuffer();
  const sharpCover = await sharp(filePath)
    .resize(upload.artwork.fileTransform)
    .toBuffer();
  const {
    dominant: { r, g, b },
  } = await sharp(filePath).stats();
  const artworkDominant = `${r}, ${g}, ${b}`;
  const artworkCoverPath = await uploadS3Object({
    fileContent: sharpCover,
    folderName: "artworkCovers",
    fileName,
  });
  const artworkMediaPath = await uploadS3Object({
    fileContent: sharpMedia,
    folderName: "artworkMedia",
    fileName,
  });
  return {
    cover: artworkCoverPath,
    media: artworkMediaPath,
    dominant: artworkDominant,
  };
};

export const verifyDimensions = async ({ filePath, fileType }) => {
  const readFile = await fs.promises.readFile(filePath);
  const dimensions = await imageSize(readFile);
  return {
    valid: dimensionsFilter({
      fileHeight: dimensions.height,
      fileWidth: dimensions.width,
      fileType,
    }),
    dimensions,
  };
};

export const deleteFileLocally = async ({ filePath }) => {
  await fs.promises.unlink(filePath);
};

export const finalizeMediaUpload = async ({ filePath, fileName, fileType }) => {
  const fileUpload = {
    fileCover: "",
    fileMedia: "",
    fileHeight: "",
    fileWidth: "",
  };
  // $TODO Verify that the user uploading the photo is valid and check its id
  if (filePath && fileName) {
    const verifiedInput = await verifyDimensions({ filePath, fileType });
    if (verifiedInput.valid) {
      const { cover, media, dominant } =
        fileType === "artwork"
          ? await artworkS3Upload({ filePath, fileName })
          : await userS3Upload({ filePath, fileName });
      deleteFileLocally({ filePath });
      fileUpload.fileCover = cover;
      fileUpload.fileMedia = media;
      fileUpload.fileDominant = dominant;
      fileUpload.fileHeight = verifiedInput.dimensions.height;
      fileUpload.fileWidth = verifiedInput.dimensions.width;
      return fileUpload;
    }
    deleteFileLocally({ filePath });
    throw createError(400, "File dimensions are not valid");
  } else {
    return fileUpload;
  }
};

export const artworkFileFilter = (req, file, cb) => {
  if (upload.artwork.mimeTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new Error("Invalid mime type, only JPEG, PNG and GIF files are allowed"),
      false
    );
};

export const userFileFilter = (req, file, cb) => {
  if (upload.user.mimeTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new Error("Invalid mime type, only JPEG, PNG and GIF files are allowed"),
      false
    );
};

export const dimensionsFilter = ({ fileHeight, fileWidth, fileType }) => {
  if (
    fileHeight < upload[fileType].fileDimensions.height ||
    fileWidth < upload[fileType].fileDimensions.width
  )
    return false;
  return true;
};

export const uploadS3Object = async ({ fileContent, folderName, fileName }) => {
  const fullPath = `${folderName}/${fileName}`;
  const s3 = new aws.S3();
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fullPath,
    Body: fileContent,
    ACL: "public-read",
  };
  const uploadedFile = await s3.upload(params).promise();
  return uploadedFile.Location;
};

export const deleteS3Object = async ({ fileLink, folderName }) => {
  const fileName = fileLink.split("/").slice(-1)[0];
  const filePath = folderName + fileName;
  const s3 = new aws.S3();
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: filePath,
  };
  await s3.deleteObject(params).promise();
};
