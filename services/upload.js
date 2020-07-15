import mongoose from 'mongoose';
import aws from 'aws-sdk';
import imageSize from 'image-size';
import fs from 'fs';
import sharp from 'sharp';
import { upload } from '../config/constants.js';
import { dimensionsFilter, uploadS3Object } from '../utils/upload.js';

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ID,
  region: process.env.S3_REGION,
});

export const userS3Upload = async ({ filePath, fileName }) => {
  const sharpMedia = await sharp(filePath).toBuffer();
  const userMediaPath = await uploadS3Object({
    fileContent: sharpMedia,
    folderName: 'userMedia',
    fileName,
  });
  return { media: userMediaPath };
};

export const artworkS3Upload = async ({ filePath, fileName }) => {
  const sharpMedia = await sharp(filePath).toBuffer();
  const sharpCover = await sharp(filePath)
    .resize(upload.artwork.fileTransform)
    .toBuffer();
  const artworkCoverPath = await uploadS3Object({
    fileContent: sharpCover,
    folderName: 'artworkCovers',
    fileName,
  });
  const artworkMediaPath = await uploadS3Object({
    fileContent: sharpMedia,
    folderName: 'artworkMedia',
    fileName,
  });
  return { cover: artworkCoverPath, media: artworkMediaPath };
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
