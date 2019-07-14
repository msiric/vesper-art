const router = require('express').Router();
const { isLoggedInAPI } = require('../../utils/helpers');
const artworkController = require('../../controllers/artworkController');

router.get('/my-artwork', isLoggedInAPI, artworkController.getUserArtwork);

router
  .route('/add-new-artwork')
  .get(isLoggedInAPI, artworkController.getNewArtwork)
  .post(isLoggedInAPI, artworkController.postNewArtwork);

router.get('/artwork-details/:id', artworkController.getArtworkDetails);

router
  .route('/edit-artwork/:id')
  .get(isLoggedInAPI, artworkController.editArtwork)
  .post(isLoggedInAPI, artworkController.updateArtwork)
  .delete(isLoggedInAPI, artworkController.deleteArtwork);

module.exports = router;
