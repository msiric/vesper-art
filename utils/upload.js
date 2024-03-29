import fs from "fs";
import createError from "http-errors";
import imageSize from "image-size";
import sharp from "sharp";
import { upload } from "../common/constants";
import { rgbToHex } from "../common/helpers";
import { errors as validationErrors } from "../common/validation";
import { uploadS3Object } from "../lib/s3";
import { formatError } from "./helpers";
import { errors } from "./statuses";
import { checkImageOrientation } from "./upload";

export const userS3Upload = async ({ filePath, fileName, mimeType }) => {
  const fileMedia = await sharp(filePath, {
    animated: upload.user.mimeTypes[mimeType].animated,
  })
    [upload.user.mimeTypes[mimeType].type]()
    .toBuffer();
  const {
    dominant: { r, g, b },
  } = await sharp(filePath).stats();
  const userDominant = rgbToHex(r, g, b);
  const userMediaPath = await uploadS3Object({
    fileContent: fileMedia,
    folderName: "userMedia",
    fileName,
    mimeType,
  });
  return { cover: "", media: userMediaPath, dominant: userDominant };
};

export const artworkS3Upload = async ({ filePath, fileName, mimeType }) => {
  const fileMedia = await sharp(filePath, {
    animated: upload.artwork.mimeTypes[mimeType].animated,
  })
    [upload.artwork.mimeTypes[mimeType].type]()
    .toBuffer();
  const fileCover = await sharp(filePath, {
    animated: upload.artwork.mimeTypes[mimeType].animated,
  })
    .resize(upload.artwork.fileTransform.width)
    [upload.artwork.mimeTypes[mimeType].type]({ quality: 100 })
    .toBuffer();
  const {
    dominant: { r, g, b },
  } = await sharp(filePath).stats();
  const artworkDominant = rgbToHex(r, g, b);
  const artworkCoverPath = await uploadS3Object({
    fileContent: fileCover,
    folderName: "artworkCovers",
    fileName,
    mimeType,
  });
  const artworkMediaPath = await uploadS3Object({
    fileContent: fileMedia,
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

export const verifyAspectRatio = ({ fileHeight, fileWidth, fileType }) => {
  const difference =
    Math.max(fileHeight, fileWidth) / Math.min(fileHeight, fileWidth);
  return difference <= upload[fileType].fileRatio;
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
  fileMedia = null,
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
    if (fileMedia) return fileUpload;
    // $TODO Verify that the user uploading the avatar is valid and check its id
    if (filePath && fileName) {
      const verifiedInput = await verifyDimensions({ filePath, fileType });
      const verifiedRatio = verifyAspectRatio({
        fileHeight: verifiedInput.dimensions.height,
        fileWidth: verifiedInput.dimensions.width,
        fileType,
      });
      if (verifiedInput.valid) {
        if (verifiedRatio) {
          const { cover, media, dominant } =
            fileType === "artwork"
              ? await artworkS3Upload({ filePath, fileName, mimeType })
              : await userS3Upload({ filePath, fileName, mimeType });
          await deleteFileLocally({ filePath });
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
        throw createError(...formatError(errors.aspectRatioInvalid));
      }
      throw createError(...formatError(errors.fileDimensionsInvalid));
    }
    return fileUpload;
  } catch (err) {
    await deleteFileLocally({ filePath });
    throw createError(err);
  }
};

export const artworkFileFilter = (req, file, cb) => {
  if (Object.keys(upload.artwork.mimeTypes).includes(file.mimetype))
    cb(null, true);
  else
    cb(createError(...formatError(validationErrors.artworkMediaType)), false);
};

export const userFileFilter = (req, file, cb) => {
  if (Object.keys(upload.user.mimeTypes).includes(file.mimetype))
    cb(null, true);
  else cb(createError(...formatError(validationErrors.userMediaType)), false);
};

export const dimensionsFilter = ({ fileHeight, fileWidth, fileType }) => {
  if (
    fileHeight < upload[fileType].fileDimensions.height ||
    fileWidth < upload[fileType].fileDimensions.width
  )
    return false;
  return true;
};

export const checkImageOrientation = (width, height) => {
  if (width > height) {
    return "landscape";
  } else if (width < height) {
    return "portrait";
  } else {
    return "square";
  }
};
