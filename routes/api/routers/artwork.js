import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import artwork from '../../../controllers/artwork.js';

const router = express.Router();

router.route('/artwork').get(artwork.getArtwork);

router.route('/artwork/:artworkId').get(artwork.getArtworkDetails);

router.route('/artwork/:artworkId/comments').get(artwork.getArtworkComments);

router.route('/artwork/:artworkId/reviews').get(artwork.getArtworkReviews);

router
  .route('/artwork/:artworkId/licenses')
  .get(isAuthenticated, artwork.getLicenses)
  .post(isAuthenticated, artwork.saveLicenses);

// router
//   .route('/artwork/:artworkId/licenses/:licenseId')
//   .delete(isAuthenticated, artwork.deleteLicense);

router.route('/my_artwork').get(isAuthenticated, artwork.getUserArtwork);

router.route('/add_artwork').post(isAuthenticated, artwork.postNewArtwork);

router
  .route('/edit_artwork/:artworkId')
  .get(isAuthenticated, artwork.editArtwork)
  .patch(isAuthenticated, artwork.updateArtwork)
  .delete(isAuthenticated, artwork.deleteArtwork);

router
  .route('/save_artwork/:artworkId')
  .post(isAuthenticated, artwork.saveArtwork)
  .delete(isAuthenticated, artwork.unsaveArtwork);

export default router;
