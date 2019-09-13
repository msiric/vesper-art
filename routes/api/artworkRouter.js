const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const artworkController = require('../../controllers/artworkController');

router.get('/my_artwork', isLoggedIn, artworkController.getUserArtwork);

router
  .route('/add_new_artwork')
  .get(isLoggedIn, artworkController.getNewArtwork)
  .post(isLoggedIn, artworkController.postNewArtwork);

router.get('/artwork_details/:id', artworkController.getArtworkDetails);

router
  .route('/edit_artwork/:id')
  .get(isLoggedIn, artworkController.editArtwork)
  .post(isLoggedIn, artworkController.updateArtwork)
  .delete(isLoggedIn, artworkController.deleteArtwork);

router
  .route('/save_artwork/:id')
  .post(isLoggedIn, artworkController.saveArtwork);

module.exports = router;
