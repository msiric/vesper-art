import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import upload from '../../../controllers/upload.js';
import multer from '../../../services/multer.js';

const profilePhotoUpload = multer.profilePhotoUpload;
const artworkMediaUpload = multer.artworkMediaUpload;
const artworkMediaEdit = multer.artworkMediaEdit;

const profilePhotoSingleUpload = profilePhotoUpload.single('userPhoto');
const artworkMediaSingleUpload = artworkMediaUpload.single('artworkMedia');
const artworkMediaSingleEdit = artworkMediaEdit.single('artworkMedia');

const router = express.Router();

router
  .route('/profile_image_upload')
  .post([isAuthenticated, profilePhotoSingleUpload], upload.postProfileImage);

router
  .route('/artwork_media_upload')
  .post([isAuthenticated, artworkMediaSingleUpload], upload.postArtworkMedia);

router
  .route('/artwork_media_upload/:id')
  .put([isAuthenticated, artworkMediaSingleEdit], upload.putArtworkMedia);

export default router;
