import mongoose from 'mongoose';
import aws from 'aws-sdk';
import { upload } from '../config/constants.js';
import imageSize from 'image-size';
import fs from 'fs';
import sharp from 'sharp';

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ID,
  region: process.env.S3_REGION,
});

export const userS3Upload = async ({ path, filename }) => {
  const sharpMedia = await sharp(path).toBuffer();
  const userMediaPath = await uploadS3Object({
    file: sharpMedia,
    folder: 'userMedia',
    filename,
  });
  return { media: userMediaPath };
};

export const artworkS3Upload = async ({ path, filename }) => {
  const sharpMedia = await sharp(path).toBuffer();
  const sharpCover = await sharp(path)
    .resize(upload.artwork.fileTransform)
    .toBuffer();
  const artworkCoverPath = await uploadS3Object({
    file: sharpCover,
    folder: 'artworkCovers',
    filename,
  });
  const artworkMediaPath = await uploadS3Object({
    file: sharpMedia,
    folder: 'artworkMedia',
    filename,
  });
  return { cover: artworkCoverPath, media: artworkMediaPath };
};

export const verifyDimensions = async ({ path, type }) => {
  const readFile = await fs.promises.readFile(path);
  const dimensions = await imageSize(readFile);
  return {
    valid: dimensionsFilter({
      height: dimensions.height,
      width: dimensions.width,
      type,
    }),
    dimensions,
  };
};

export const deleteFileLocally = async ({ path }) => {
  await fs.promises.unlink(path);
};

export const finalizeMediaUpload = async ({ path, filename, type }) => {
  const artworkUpload = {
    artworkCover: '',
    artworkMedia: '',
    artworkHeight: '',
    artworkWidth: '',
  };
  // $TODO Verify that the user uploading the photo is valid and check its id
  if (path && filename) {
    const verifiedInput = await verifyDimensions({ path, type });
    if (verifiedInput.valid) {
      const { cover, media } = await artworkS3Upload({ path, filename });
      deleteFileLocally({ path });
      artworkUpload.artworkCover = cover;
      artworkUpload.artworkMedia = media;
      artworkUpload.artworkHeight = verifiedInput.dimensions.height;
      artworkUpload.artworkWidth = verifiedInput.dimensions.width;
      return artworkUpload;
    }
    deleteFileLocally({ path });
    throw createError(400, 'File dimensions are not valid');
  } else {
    return artworkUpload;
  }
};

export const artworkFileFilter = (req, file, cb) => {
  if (upload.artwork.mimeTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new Error('Invalid mime type, only JPEG, PNG and GIF files are allowed'),
      false
    );
};

export const userFileFilter = (req, file, cb) => {
  if (upload.user.mimeTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new Error('Invalid mime type, only JPEG, PNG and GIF files are allowed'),
      false
    );
};

export const dimensionsFilter = ({ height, width, type }) => {
  if (
    height < upload[type].fileDimensions.height ||
    width < upload[type].fileDimensions.width
  )
    return false;
  return true;
};

export const uploadS3Object = async ({ file, folder, filename }) => {
  const fullPath = `${folder}/${filename}`;
  const s3 = new aws.S3();
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fullPath,
    Body: file,
    ACL: 'public-read',
  };
  const uploadedFile = await s3.upload(params).promise();
  return uploadedFile.Location;
};

export const deleteS3Object = async ({ link, folder }) => {
  const fileLink = link;
  const folderName = folder;
  const fileName = fileLink.split('/').slice(-1)[0];
  const filePath = folderName + fileName;
  const s3 = new aws.S3();
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: filePath,
  };
  await s3.deleteObject(params).promise();
};
