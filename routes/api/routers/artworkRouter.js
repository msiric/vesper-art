const router = require('express').Router();
const { isAuthenticated } = require('../../../utils/helpers');
const artworkController = require('../../../controllers/artworkController');

router.get('/my_artwork', isAuthenticated, artworkController.getUserArtwork);

router
  .route('/add_new_artwork')
  .post(isAuthenticated, artworkController.postNewArtwork);

router.get('/artwork_details/:id', artworkController.getArtworkDetails);

router
  .route('/edit_artwork/:id')
  .get(isAuthenticated, artworkController.editArtwork)
  .put(isAuthenticated, artworkController.updateArtwork)
  .delete(isAuthenticated, artworkController.deleteArtwork);

router
  .route('/save_artwork/:id')
  .post(isAuthenticated, artworkController.saveArtwork);

module.exports = router;
