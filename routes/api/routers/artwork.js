import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import {
  getArtwork,
  getArtworkDetails,
  getArtworkComments,
  getArtworkReviews,
  getLicenses,
  saveLicenses,
  getUserArtwork,
  postNewArtwork,
  editArtwork,
  updateArtwork,
  deleteArtwork,
  saveArtwork,
  unsaveArtwork,
} from '../../../controllers/artwork.js';

const router = express.Router();

router.route('/artwork').get(
  handler(getArtwork, false, (req, res, next) => ({
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/artwork/:artworkId').get(
  handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  handler(getArtworkDetails, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/artwork/:artworkId/comments').get(
  handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  handler(getArtworkComments, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/artwork/:artworkId/reviews').get(
  handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  handler(getArtworkReviews, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router
  .route('/artwork/:artworkId/licenses')
  .get(
    [
      handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
      handler(checkParamsId, false, (req, res, next) => (req, res, next)),
    ],
    handler(getLicenses, false, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .post(
    [
      handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
      handler(checkParamsId, false, (req, res, next) => (req, res, next)),
    ],
    handler(saveLicenses, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
      licenses: req.body.licenses,
    }))
  );

// router
//   .route('/artwork/:artworkId/licenses/:licenseId')
//   .delete(handler(isAuthenticated, false, (req, res, next) => (req, res, next)), artwork.deleteLicense);

router.route('/my_artwork').get(
  handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
  handler(getUserArtwork, false, (req, res, next) => ({
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/add_artwork').post(
  handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
  handler(postNewArtwork, true, (req, res, next) => ({
    artworkData: req.body,
  }))
);

router
  .route('/edit_artwork/:artworkId')
  .get(
    [
      handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
      handler(checkParamsId, false, (req, res, next) => (req, res, next)),
    ],
    handler(editArtwork, false, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .patch(
    [
      handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
      handler(checkParamsId, false, (req, res, next) => (req, res, next)),
    ],
    handler(updateArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
      artworkData: req.body,
    }))
  )
  .delete(
    [
      handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
      handler(checkParamsId, false, (req, res, next) => (req, res, next)),
    ],
    handler(deleteArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  );

router
  .route('/save_artwork/:artworkId')
  .post(
    [
      handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
      handler(checkParamsId, false, (req, res, next) => (req, res, next)),
    ],
    handler(saveArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .delete(
    [
      handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
      handler(checkParamsId, false, (req, res, next) => (req, res, next)),
    ],
    handler(unsaveArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
      cursor: req.query.cursor,
      ceiling: req.query.ceiling,
    }))
  );

export default router;
