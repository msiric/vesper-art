import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import {
  postProfileImage,
  postArtworkMedia,
  putArtworkMedia,
} from '../../../controllers/upload.js';
import multerApi from '../../../lib/multer.js';

const router = express.Router();

router.route('/profile_image_upload').post(
  [
    handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
    multerApi.uploadUserLocal,
  ],
  handler(postProfileImage, false, (req, res, next) => ({
    path: req.file.path,
    filename: req.file.filename,
  }))
);

router.route('/artwork_media_upload').post(
  [
    handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
    multerApi.uploadArtworkLocal,
  ],
  handler(postArtworkMedia, false, (req, res, next) => ({
    path: req.file.path,
    filename: req.file.filename,
  }))
);

router.route('/artwork_media_upload/:id').put(
  [
    handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
    handler(checkParamsId, false, (req, res, next) => (req, res, next)),
    multerApi.uploadArtworkLocal,
  ],
  handler(putArtworkMedia, false, (req, res, next) => ({
    path: req.file.path,
    filename: req.file.filename,
  }))
);

export default router;
