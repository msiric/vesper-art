const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const uploadController = require('../../controllers/uploadController');

const upload = require('../../services/multer');

const profilePhotoUpload = upload.profilePhotoUpload;
/* const artworkCoverUpload = upload.artworkCoverUpload; */
/* const artworkCoverEdit = upload.artworkCoverEdit; */
const artworkMediaUpload = upload.artworkMediaUpload;
const artworkMediaEdit = upload.artworkMediaEdit;
/* const artworkMediaEdit = upload.artworkMediaEdit; */

const profilePhotoSingleUpload = profilePhotoUpload.single('image');
/* const artworkCoverSingleUpload = artworkCoverUpload.single('image');
const artworkCoverSingleEdit = artworkCoverEdit.single('image'); */
const artworkMediaSingleUpload = artworkMediaUpload.single('artwork_media');
const artworkMediaSingleEdit = artworkMediaEdit.single('artwork_media');
/* const artworkMediaSingleEdit = artworkMediaEdit.single('image'); */

router.post(
  '/profile_image_upload',
  [isLoggedIn, profilePhotoSingleUpload],
  uploadController.postProfileImage
);

router.post(
  '/artwork_media_upload',
  [isLoggedIn, artworkMediaSingleUpload],
  uploadController.postArtworkMedia
);

router.put(
  '/artwork_media_edit/:id',
  [isLoggedIn, artworkMediaSingleEdit],
  uploadController.putArtworkMedia
);

/* 
router.post(
  '/artwork_cover_edit/:id',
  [isLoggedIn, artworkCoverSingleEdit],
  uploadController.updateArtworkCover
);

router.post(
  '/artwork_media_upload',
  [isLoggedIn, artworkMediaSingleUpload],
  uploadController.postArtworkMedia
);

router.post(
  '/artwork_media_edit/:id',
  [isLoggedIn, artworkMediaSingleEdit],
  uploadController.updateArtworkMedia
); */

module.exports = router;
