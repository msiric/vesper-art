const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const uploadController = require('../../../controllers/uploadController');
const upload = require('../../../services/multer');

const profilePhotoUpload = upload.profilePhotoUpload;
const artworkMediaUpload = upload.artworkMediaUpload;
const artworkMediaEdit = upload.artworkMediaEdit;

const profilePhotoSingleUpload = profilePhotoUpload.single('image');
const artworkMediaSingleUpload = artworkMediaUpload.single('artworkMedia');
const artworkMediaSingleEdit = artworkMediaEdit.single('artworkMedia');

router
  .route('/profile_image_upload')
  .post(
    [isAuthenticated, profilePhotoSingleUpload],
    uploadController.postProfileImage
  );

router
  .route('/artwork_media_upload')
  .post(
    [isAuthenticated, artworkMediaSingleUpload],
    uploadController.postArtworkMedia
  );

router
  .route('/artwork_media_edit/:id')
  .put(
    [isAuthenticated, artworkMediaSingleEdit],
    uploadController.putArtworkMedia
  );

module.exports = router;
