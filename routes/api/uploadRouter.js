const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const uploadController = require('../../controllers/uploadController');

const upload = require('../../services/multer');

const profilePhotoUpload = upload.profilePhotoUpload;
const artworkCoverUpload = upload.artworkCoverUpload;
const artworkCoverEdit = upload.artworkCoverEdit;
const artworkMediaUpload = upload.artworkMediaUpload;
const artworkMediaEdit = upload.artworkMediaEdit;

const profilePhotoSingleUpload = profilePhotoUpload.single('image');
const artworkCoverSingleUpload = artworkCoverUpload.single('image');
const artworkCoverSingleEdit = artworkCoverEdit.single('image');
const artworkMediaSingleUpload = artworkMediaUpload.single('image');
const artworkMediaSingleEdit = artworkMediaEdit.single('image');

router.post(
  '/profile-image-upload',
  [isLoggedIn, profilePhotoSingleUpload],
  uploadController.postProfileImage
);

router.post(
  '/artwork-cover-upload',
  [isLoggedIn, artworkCoverSingleUpload],
  uploadController.postArtworkCover
);

router.post(
  '/artwork-cover-edit/:id',
  [isLoggedIn, artworkCoverSingleEdit],
  uploadController.updateArtworkCover
);

router.post(
  '/artwork-media-upload',
  [isLoggedIn, artworkMediaSingleUpload],
  uploadController.postArtworkMedia
);

router.post(
  '/artwork-media-edit/:id',
  [isLoggedIn, artworkMediaSingleEdit],
  uploadController.updateArtworkMedia
);

module.exports = router;
