const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const artworkController = require('../../../controllers/artworkController');

router.route('/artwork').get(artworkController.getArtwork);

router
  .route('/my_artwork')
  .get(isAuthenticated, artworkController.getUserArtwork);

router
  .route('/add_artwork')
  .post(isAuthenticated, artworkController.postNewArtwork);

router.route('/artwork_details/:id').get(artworkController.getArtworkDetails);

router
  .route('/edit_artwork/:id')
  .get(isAuthenticated, artworkController.editArtwork)
  .patch(isAuthenticated, artworkController.updateArtwork)
  .delete(isAuthenticated, artworkController.deleteArtwork);

router
  .route('/save_artwork/:id')
  .post(isAuthenticated, artworkController.saveArtwork);

module.exports = router;
