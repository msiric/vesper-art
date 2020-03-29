const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const uploadController = require('../../../controllers/uploadController');

const upload = require('../../../services/multer');

const profilePhotoUpload = upload.profilePhotoUpload;
/* const artworkCoverUpload = upload.artworkCoverUpload; */
/* const artworkCoverEdit = upload.artworkCoverEdit; */
const artworkMediaUpload = upload.artworkMediaUpload;
const artworkMediaEdit = upload.artworkMediaEdit;
/* const artworkMediaEdit = upload.artworkMediaEdit; */

const profilePhotoSingleUpload = profilePhotoUpload.single('image');
/* const artworkCoverSingleUpload = artworkCoverUpload.single('image');
const artworkCoverSingleEdit = artworkCoverEdit.single('image'); */
const artworkMediaSingleUpload = artworkMediaUpload.single('artworkMedia');
const artworkMediaSingleEdit = artworkMediaEdit.single('artworkMedia');
/* const artworkMediaSingleEdit = artworkMediaEdit.single('image'); */

router.post(
  '/profile_image_upload',
  [isAuthenticated, profilePhotoSingleUpload],
  uploadController.postProfileImage
);

router.post(
  '/artwork_media_upload',
  [isAuthenticated, artworkMediaSingleUpload],
  uploadController.postArtworkMedia
);

router.put(
  '/artwork_media_edit/:id',
  [isAuthenticated, artworkMediaSingleEdit],
  uploadController.putArtworkMedia
);

/* 
router.post(
  '/artwork_cover_edit/:id',
  [isAuthenticated, artworkCoverSingleEdit],
  uploadController.updateArtworkCover
);

router.post(
  '/artwork_media_upload',
  [isAuthenticated, artworkMediaSingleUpload],
  uploadController.postArtworkMedia
);

router.post(
  '/artwork_media_edit/:id',
  [isAuthenticated, artworkMediaSingleEdit],
  uploadController.updateArtworkMedia
); */

module.exports = router;
