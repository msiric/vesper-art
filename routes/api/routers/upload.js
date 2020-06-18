import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import upload from '../../../controllers/upload.js';
import multer from '../../../services/multer.js';

const profilePhotoUpload = multer.profilePhotoUpload;
const artworkMediaUpload = multer.artworkMediaUpload;
const artworkMediaEdit = multer.artworkMediaEdit;

const profilePhotoSingleUpload = profilePhotoUpload.single('userPhoto');
const artworkMediaSingleUpload = artworkMediaUpload.single('artworkMedia');
const artworkMediaSingleEdit = artworkMediaEdit.single('artworkMedia');

const router = express.Router();

router.route('/profile_image_upload').post(
  [isAuthenticated, profilePhotoSingleUpload],
  handler(upload.postProfileImage, false, (req, res, next) => ({
    req,
    res,
    next,
  }))
);

router.route('/artwork_media_upload').post(
  [isAuthenticated, artworkMediaSingleUpload],
  handler(upload.postArtworkMedia, false, (req, res, next) => ({
    req,
    res,
    next,
  }))
);

router.route('/artwork_media_upload/:id').put(
  [isAuthenticated, checkParamsId, artworkMediaSingleEdit],
  handler(upload.putArtworkMedia, false, (req, res, next) => ({
    req,
    res,
    next,
  }))
);

export default router;
