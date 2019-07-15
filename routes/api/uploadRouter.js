const router = require('express').Router();
const { isLoggedInAPI } = require('../../utils/helpers');
const uploadController = require('../../controllers/uploadController');

router.post(
  '/profile-image-upload',
  isLoggedInAPI,
  uploadController.postProfileImage
);

router.post(
  '/artwork-cover-upload',
  isLoggedInAPI,
  uploadController.postArtworkCover
);

router.post(
  '/artwork-cover-edit/:id',
  isLoggedInAPI,
  uploadController.updateArtworkCover
);

module.exports = router;
