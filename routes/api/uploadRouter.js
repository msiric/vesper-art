const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const uploadController = require('../../controllers/uploadController');

const upload = require('../../services/multer');

const profilePhotoUpload = upload.profilePhotoUpload;
const artworkCoverUpload = upload.artworkCoverUpload;
const artworkCoverEdit = upload.artworkCoverEdit;

const profilePhotoSingleUpload = profilePhotoUpload.single('image');
const artworkCoverSingleUpload = artworkCoverUpload.single('image');
const artworkCoverSingleEdit = artworkCoverEdit.single('image');

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

module.exports = router;
