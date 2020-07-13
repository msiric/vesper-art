import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import { finalizeMediaUpload } from '../../../utils/upload.js';
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
import multerApi from '../../../lib/multer.js';

const router = express.Router();

router.route('/artwork').get(
  handler(getArtwork, false, (req, res, next) => ({
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/artwork/:artworkId').get(
  checkParamsId,
  handler(getArtworkDetails, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/artwork/:artworkId/comments').get(
  checkParamsId,
  handler(getArtworkComments, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/artwork/:artworkId/reviews').get(
  checkParamsId,
  handler(getArtworkReviews, false, (req, res, next) => ({
    artworkId: req.params.artworkId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router
  .route('/artwork/:artworkId/licenses')
  .get(
    [isAuthenticated, checkParamsId],
    handler(getLicenses, false, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .post(
    [isAuthenticated, checkParamsId],
    handler(saveLicenses, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
      licenses: req.body.licenses,
    }))
  );

// router
//   .route('/artwork/:artworkId/licenses/:licenseId')
//   .delete(isAuthenticated, artwork.deleteLicense);

router.route('/my_artwork').get(
  isAuthenticated,
  handler(getUserArtwork, false, (req, res, next) => ({
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/add_artwork').post(
  [isAuthenticated, multerApi.uploadArtworkLocal],
  handler(postNewArtwork, true, (req, res, next) => ({
    artworkPath: req.file ? req.file.path : '',
    artworkFilename: req.file ? req.file.filename : '',
    artworkData: req.body,
  }))
);

router
  .route('/edit_artwork/:artworkId')
  .get(
    [isAuthenticated, checkParamsId],
    handler(editArtwork, false, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .patch(
    [isAuthenticated, checkParamsId, multerApi.uploadArtworkLocal],
    handler(updateArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
      artworkPath: req.file ? req.file.path : '',
      artworkFilename: req.file ? req.file.filename : '',
      artworkData: req.body,
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deleteArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  );

router
  .route('/save_artwork/:artworkId')
  .post(
    [isAuthenticated, checkParamsId],
    handler(saveArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(unsaveArtwork, true, (req, res, next) => ({
      artworkId: req.params.artworkId,
      cursor: req.query.cursor,
      ceiling: req.query.ceiling,
    }))
  );

export default router;
