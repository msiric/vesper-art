const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const artworkController = require('../../../controllers/artworkController');

router.route('/artwork').get(artworkController.getArtwork);

router.route('/artwork/:artworkId').get(artworkController.getArtworkDetails);

router
  .route('/artwork/:artworkId/licenses')
  .get(isAuthenticated, artworkController.getLicenses)
  .post(isAuthenticated, artworkController.saveLicenses);

// router
//   .route('/artwork/:artworkId/licenses/:licenseId')
//   .delete(isAuthenticated, artworkController.deleteLicense);

router
  .route('/my_artwork')
  .get(isAuthenticated, artworkController.getUserArtwork);

router
  .route('/add_artwork')
  .post(isAuthenticated, artworkController.postNewArtwork);

router
  .route('/edit_artwork/:artworkId')
  .get(isAuthenticated, artworkController.editArtwork)
  .patch(isAuthenticated, artworkController.updateArtwork)
  .delete(isAuthenticated, artworkController.deleteArtwork);

router
  .route('/save_artwork/:artworkId')
  .post(isAuthenticated, artworkController.saveArtwork)
  .delete(isAuthenticated, artworkController.unsaveArtwork);

module.exports = router;
