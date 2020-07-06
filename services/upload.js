import mongoose from 'mongoose';
import aws from 'aws-sdk';
import imageSize from 'image-size';
import fs from 'fs';
import sharp from 'sharp';
import { upload } from '../config/constants.js';
import { dimensionsFilter, uploadS3Object } from '../utils/helpers.js';

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
