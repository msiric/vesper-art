import mongoose from "mongoose";
import aws from "aws-sdk";
import { upload } from "../config/constants.js";

export const artworkFileFilter = (req, file, cb) => {
  if (upload.artwork.mimeTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new Error("Invalid Mime Type, only JPEG, PNG and GIF files are allowed"),
      false
    );
};

export const userFileFilter = (req, file, cb) => {
  if (upload.user.mimeTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new Error("Invalid Mime Type, only JPEG, PNG and GIF files are allowed"),
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
    ACL: "public-read",
  };
  const uploadedFile = await s3.upload(params).promise();
  return uploadedFile.Location;
};

export const deleteS3Object = async ({ link, folder }) => {
  const fileLink = link;
  const folderName = folder;
  const fileName = fileLink.split("/").slice(-1)[0];
  const filePath = folderName + fileName;
  const s3 = new aws.S3();
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: filePath,
  };
  await s3.deleteObject(params).promise();
};
