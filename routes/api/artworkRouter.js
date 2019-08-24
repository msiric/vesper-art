const router = require('express').Router();
const { isLoggedIn } = require('../../utils/helpers');
const artworkController = require('../../controllers/artworkController');

router.get('/my-artwork', isLoggedIn, artworkController.getUserArtwork);

router
  .route('/add-new-artwork')
  .get(isLoggedIn, artworkController.getNewArtwork)
  .post(isLoggedIn, artworkController.postNewArtwork);

router.get('/artwork-details/:id', artworkController.getArtworkDetails);

router
  .route('/edit-artwork/:id')
  .get(isLoggedIn, artworkController.editArtwork)
  .post(isLoggedIn, artworkController.updateArtwork)
  .delete(isLoggedIn, artworkController.deleteArtwork);

module.exports = router;
