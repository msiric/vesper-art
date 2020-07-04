import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import fs from 'fs';
import imageSize from 'image-size';
import upload from '../../../controllers/upload.js';
import multer from '../../../services/multer.js';

const profilePhotoUpload = multer.profilePhotoUpload;
const artworkLocalUpload = multer.artworkLocalUpload;

const profilePhotoSingleUpload = profilePhotoUpload.single('userPhoto');
const artworkMediaSingleUpload = artworkLocalUpload.single('artworkMedia');

const router = express.Router();

router.route('/profile_image_upload').post(
  [isAuthenticated, profilePhotoSingleUpload],
  handler(upload.postProfileImage, true, (req, res, next) => ({
    location: req.file.location,
  }))
);

router.route('/artwork_media_upload').post(
  [isAuthenticated, artworkMediaSingleUpload],
  handler(upload.postArtworkMedia, false, (req, res, next) => ({
    path: req.file.path,
    filename: req.file.filename,
  }))
);

router.route('/artwork_media_upload/:id').put(
  [isAuthenticated, checkParamsId, artworkMediaSingleUpload],
  handler(upload.putArtworkMedia, false, (req, res, next) => ({
    cover: req.file.transforms[0].location,
    media: req.file.transforms[1].location,
  }))
);

export default router;
