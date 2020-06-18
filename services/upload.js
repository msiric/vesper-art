import mongoose from 'mongoose';
import aws from 'aws-sdk';

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

// $TODO Wat
export const updateArtworkMedia = async ({ artworkCover, artworkMedia }) => {
  return {
    artworkCover,
    artworkMedia,
  };
};
