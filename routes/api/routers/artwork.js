import express from 'express';
import {
  isAuthenticated,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import artwork from '../../../controllers/artwork.js';

const router = express.Router();

router.route('/artwork').get(
  handler(artwork.getArtwork, false, (req, res, next) => ({
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/artwork/:artworkId').get(
  handler(artwork.getArtworkDetails, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/artwork/:artworkId/comments').get(
  handler(artwork.getArtworkComments, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/artwork/:artworkId/reviews').get(
  handler(artwork.getArtworkReviews, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router
  .route('/artwork/:artworkId/licenses')
  .get(
    isAuthenticated,
    handler(artwork.getLicenses, false, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .post(
    isAuthenticated,
    handler(artwork.saveLicenses, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
      licenses: req.body.licenses,
    }))
  );

// router
//   .route('/artwork/:artworkId/licenses/:licenseId')
//   .delete(isAuthenticated, artwork.deleteLicense);

router.route('/my_artwork').get(
  isAuthenticated,
  handler(artwork.getUserArtwork, false, (req, res, next) => ({
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/add_artwork').post(
  isAuthenticated,
  handler(artwork.postNewArtwork, true, (req, res, next) => ({
    artworkData: req.body,
  }))
);

router
  .route('/edit_artwork/:artworkId')
  .get(
    isAuthenticated,
    handler(artwork.editArtwork, false, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .patch(
    isAuthenticated,
    handler(artwork.updateArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .delete(
    isAuthenticated,
    handler(artwork.deleteArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  );

router
  .route('/save_artwork/:artworkId')
  .post(
    isAuthenticated,
    handler(artwork.saveArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .delete(
    isAuthenticated,
    handler(artwork.unsaveArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
      cursor: req.query.cursor,
      ceiling: req.query.ceiling,
    }))
  );

export default router;
