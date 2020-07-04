import mongoose from 'mongoose';
import aws from 'aws-sdk';
import imageSize from 'image-size';
import fs from 'fs';
import multer from 'multer';
import multerS3 from 'multer-s3-transform';
import path from 'path';
import sharp from 'sharp';
import jwt from 'jsonwebtoken';

aws.config.update({
  secretAccessKey: 'TZhmTLVh6KSBJRfYK2aq2eqoiYbIEncgzUptgGON',
  accessKeyId: 'AKIAIVOLPF2TBRAQ4CEQ',
  region: 'eu-west-3',
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid Mime Type, only JPEG, PNG and GIF files are allowed'),
      false
    );
  }
};

const dimensionsFilter = (height, width) => {
  if (height < 10 || width < 10) return false;
  return true;
};

// needs transaction (done)
export const createProfileImage = async ({}) => {
  const folderName = 'profilePhotos/';
  const fileName = foundUser.photo.split('/').slice(-1)[0];
  const filePath = folderName + fileName;
  const s3 = new aws.S3();
  const params = {
    Bucket: 'vesper-testing',
    Key: filePath,
  };
  return await s3.deleteObject(params).promise();
};

// $TODO Wat
export const createArtworkMedia = async ({ req }) => {
  return {
    artworkCover: req.file.transforms[0].location,
    artworkMedia: req.file.transforms[1].location,
  };
};

export const verifyDimensions = async ({ path }) => {
  const readFile = await fs.promises.readFile(path);
  const dimensions = await imageSize(readFile);
  return {
    valid: dimensionsFilter(dimensions.height, dimensions.width),
    dimensions,
  };
};

export const deleteFileLocally = ({ path }) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.log('failed to delete local image:' + err);
    } else {
      console.log('successfully deleted local image');
    }
  });
};

export const artworkS3Upload = async ({ path, filename }) => {
  const sharpMedia = await sharp(path).toBuffer();
  const sharpCover = await sharp(path).resize({ width: 500 }).toBuffer();
  const artworkCoverPath = await uploadImageS3({
    file: sharpCover,
    folder: 'artworkCovers',
    filename,
  });
  const artworkMediaPath = await uploadImageS3({
    file: sharpMedia,
    folder: 'artworkMedia',
    filename,
  });
  return { cover: artworkCoverPath, media: artworkMediaPath };
};

export const uploadImageS3 = async ({ file, folder, filename }) => {
  const fullPath = `${folder}/${filename}`;
  const s3 = new aws.S3();
  const params = {
    Bucket: 'vesper-testing',
    Key: fullPath,
    Body: file,
    ACL: 'public-read',
  };
  const uploadedFile = await s3.upload(params).promise();
  return uploadedFile.Location;
};

// $TODO Wat
export const updateArtworkMedia = async ({ artworkCover, artworkMedia }) => {
  return {
    artworkCover,
    artworkMedia,
  };
};
