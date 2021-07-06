import aws from "aws-sdk";
import fs from "fs";
import createError from "http-errors";
import imageSize from "image-size";
import sharp from "sharp";
import { upload } from "../common/constants";
import { rgbToHex } from "../common/helpers";
import { checkImageOrientation, formatError } from "./helpers";
import { errors } from "./statuses";

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ID,
  region: process.env.S3_REGION,
});

const SHARP_FORMATS = {
  "image/png": { type: "png", animated: false },
  "image/jpg": { type: "jpeg", animated: false },
  "image/jpeg": { type: "jpeg", animated: false },
  "image/gif": { type: "gif", animated: true },
};

const ALLOWED_RATIO = 5;

export const userS3Upload = async ({ filePath, fileName, mimeType }) => {
  const sharpMedia = await sharp(filePath, {
    animated: SHARP_FORMATS[mimeType].animated,
  })
    [SHARP_FORMATS[mimeType].type]()
    .toBuffer();
  const {
    dominant: { r, g, b },
  } = await sharp(filePath).stats();
  const userDominant = rgbToHex(r, g, b);
  const userMediaPath = await uploadS3Object({
    fileContent: sharpMedia,
    folderName: "userMedia",
    fileName,
    mimeType,
  });
  return { cover: "", media: userMediaPath, dominant: userDominant };
};

export const artworkS3Upload = async ({ filePath, fileName, mimeType }) => {
  const sharpMedia = await sharp(filePath, {
    animated: SHARP_FORMATS[mimeType].animated,
  })
    [SHARP_FORMATS[mimeType].type]()
    .toBuffer();
  const sharpCover = await sharp(filePath, {
    animated: SHARP_FORMATS[mimeType].animated,
  })
    .resize(upload.artwork.fileTransform.width)
    [SHARP_FORMATS[mimeType].type]({ quality: 100 })
    .toBuffer();
  const {
    dominant: { r, g, b },
  } = await sharp(filePath).stats();
  const artworkDominant = rgbToHex(r, g, b);
  const artworkCoverPath = await uploadS3Object({
    fileContent: sharpCover,
    folderName: "artworkCovers",
    fileName,
    mimeType,
  });
  const artworkMediaPath = await uploadS3Object({
    fileContent: sharpMedia,
    folderName: "artworkMedia",
    fileName,
    mimeType,
  });
  return {
    cover: artworkCoverPath,
    media: artworkMediaPath,
    dominant: artworkDominant,
  };
};

export const verifyAspectRatio = async ({ fileHeight, fileWidth }) => {
  const difference =
    Math.max(fileHeight, fileWidth) / Math.min(fileHeight, fileWidth);
  return difference <= ALLOWED_RATIO;
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

export const finalizeMediaUpload = async ({
  filePath,
  fileName,
  mimeType,
  fileType,
}) => {
  const fileUpload = {
    fileCover: "",
    fileMedia: "",
    fileDominant: "",
    fileHeight: "",
    fileWidth: "",
    fileOrientation: "",
  };
  try {
    // $TODO Verify that the user uploading the avatar is valid and check its id
    if (filePath && fileName) {
      const verifiedInput = await verifyDimensions({ filePath, fileType });
      const verifiedRatio = verifyAspectRatio({
        fileHeight: verifiedInput.dimensions.height,
        fileWidth: verifiedInput.dimensions.width,
      });
      if (verifiedInput.valid) {
        if (verifiedRatio) {
          const { cover, media, dominant } =
            fileType === "artwork"
              ? await artworkS3Upload({ filePath, fileName, mimeType })
              : await userS3Upload({ filePath, fileName, mimeType });
          deleteFileLocally({ filePath });
          fileUpload.fileCover = cover;
          fileUpload.fileMedia = media;
          fileUpload.fileDominant = dominant;
          fileUpload.fileHeight = verifiedInput.dimensions.height;
          fileUpload.fileWidth = verifiedInput.dimensions.width;
          fileUpload.fileOrientation = checkImageOrientation(
            verifiedInput.dimensions.width,
            verifiedInput.dimensions.height
          );
          return fileUpload;
        }
        deleteFileLocally({ filePath });
        throw createError(...formatError(errors.aspectRatioInvalid));
      }
      deleteFileLocally({ filePath });
      throw createError(...formatError(errors.fileDimensionsInvalid));
    } else {
      return fileUpload;
    }
  } catch (err) {
    deleteFileLocally({ filePath });
    throw createError(statusCodes.internalError, err, { expose: true });
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

export const uploadS3Object = async ({
  fileContent,
  folderName,
  fileName,
  mimeType,
}) => {
  const fullPath = `${folderName}/${fileName}`;
  const s3 = new aws.S3();
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fullPath,
    Body: fileContent,
    ACL: "public-read",
    ContentType: mimeType,
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
