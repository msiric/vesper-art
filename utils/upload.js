import fs from "fs";
import createError from "http-errors";
import sharp from "sharp";
import { upload } from "../common/constants";
import { rgbToHex } from "../common/helpers";
import { errors as validationErrors } from "../common/validation";
import { uploadS3Object } from "../lib/s3";
import { formatError } from "./helpers";
import { errors } from "./statuses";

sharp.cache({ memory: 16, files: 0, items: 20 });
sharp.concurrency(1);
const imageOptions = { limitInputPixels: 4000000, animated: false };
export const userS3Upload = async ({ filePath, fileName }) => {
  const {data:media,info} = await sharp(filePath,imageOptions).resize(256,256,{fit:'inside',withoutEnlargement:true}).jpeg({quality:80}).toBuffer({resolveWithObject:true});
  const { dominant: { r,g,b } } = await sharp(filePath,imageOptions).stats();
  return { width:info.width,height:info.height,cover:'', media:await uploadS3Object({fileContent:media,fileName,folderName:'userMedia',mimeType:'image/jpeg'}),dominant:rgbToHex(r,g,b) };
};
export const artworkS3Upload = async ({ filePath, fileName }) => {
  const {data:original,info} = await sharp(filePath,imageOptions).resize(1600,1600,{fit:'inside',withoutEnlargement:true}).jpeg({quality:80}).toBuffer({resolveWithObject:true});
  const preview = await sharp(filePath,imageOptions).resize(640,640,{fit:'inside',withoutEnlargement:true}).jpeg({quality:75}).toBuffer();
  if (original.length + preview.length > 768 * 1024) throw createError(413,'The image is too detailed for this small demo. Try a smaller image.');
  const { dominant: { r,g,b } } = await sharp(filePath,imageOptions).stats();
  return {
    width:info.width,height:info.height,
    media:await uploadS3Object({fileContent:original,fileName,folderName:'artworkMedia',mimeType:'image/jpeg'}),
    cover:await uploadS3Object({fileContent:preview,fileName,folderName:'artworkCovers',mimeType:'image/jpeg'}),
    dominant:rgbToHex(r,g,b),
  };
};

export const verifyAspectRatio = ({ fileHeight, fileWidth, fileType }) => {
  const difference =
    Math.max(fileHeight, fileWidth) / Math.min(fileHeight, fileWidth);
  return difference <= upload[fileType].fileRatio;
};

export const verifyDimensions = async ({ filePath, fileType }) => {
  const dimensions = await sharp(filePath,imageOptions).metadata();
  if (!["jpeg","png"].includes(dimensions.format) || (dimensions.pages || 1) > 1) throw createError(400,"Only single-frame JPEG and PNG images are supported");
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
  if (filePath) await fs.promises.unlink(filePath).catch(error => { if (error.code !== "ENOENT") throw error; });
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
          const { cover, media, dominant, width, height } =
            fileType === "artwork"
              ? await artworkS3Upload({ filePath, fileName, mimeType })
              : await userS3Upload({ filePath, fileName, mimeType });
          await deleteFileLocally({ filePath });
          fileUpload.fileCover = cover;
          fileUpload.fileMedia = media;
          fileUpload.fileDominant = dominant;
          fileUpload.fileHeight = height;
          fileUpload.fileWidth = width;
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
