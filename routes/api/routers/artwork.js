import express from "express";
import {
  deleteArtwork,
  favoriteArtwork,
  getArtwork,
  getArtworkComments,
  getArtworkDetails,
  getArtworkReviews,
  getLicenses,
  postNewArtwork,
  saveLicense,
  unfavoriteArtwork,
  updateArtwork,
} from "../../../controllers/artwork.js";
import {
  deleteComment,
  getComment,
  patchComment,
  postComment,
} from "../../../controllers/comment.js";
import multerApi from "../../../lib/multer.js";
import {
  checkParamsId,
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router
  .route("/artwork")
  .get(
    handler(getArtwork, (req, res, next) => ({
      ...req.query,
    }))
  )
  .post(
    [isAuthenticated, multerApi.uploadArtworkLocal],
    handler(postNewArtwork, (req, res, next) => ({
      artworkPath: req.file ? req.file.path : "",
      artworkFilename: req.file ? req.file.filename : "",
      artworkMimetype: req.file ? req.file.mimetype : "",
      artworkData: { ...req.body },
    }))
  );

router
  .route("/artwork/:artworkId")
  .get(
    checkParamsId,
    handler(getArtworkDetails, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  )
  .patch(
    [isAuthenticated, checkParamsId, multerApi.uploadArtworkLocal],
    handler(updateArtwork, (req, res, next) => ({
      ...req.params,
      artworkPath: req.file ? req.file.path : "",
      artworkFilename: req.file ? req.file.filename : "",
      artworkMimetype: req.file ? req.file.mimetype : "",
      artworkData: { ...req.body },
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deleteArtwork, (req, res, next) => ({
      ...req.params,
    }))
  );

router.route("/artwork/:artworkId/comments").get(
  checkParamsId,
  handler(getArtworkComments, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/artwork/:artworkId/reviews").get(
  checkParamsId,
  handler(getArtworkReviews, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router
  .route("/artwork/:artworkId/licenses")
  .get(
    [isAuthenticated, checkParamsId],
    handler(getLicenses, (req, res, next) => ({
      ...req.params,
    }))
  )
  .post(
    [isAuthenticated, checkParamsId],
    handler(saveLicense, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/artwork/:artworkId/favorites")
  .post(
    [isAuthenticated, checkParamsId],
    handler(favoriteArtwork, (req, res, next) => ({
      ...req.params,
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(unfavoriteArtwork, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router.route("/artwork/:artworkId/comments").post(
  [isAuthenticated, checkParamsId],
  handler(postComment, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router
  .route("/artwork/:artworkId/comments/:commentId")
  .get(
    [isAuthenticated, checkParamsId],
    handler(getComment, (req, res, next) => ({
      ...req.params,
    }))
  )
  .patch(
    [isAuthenticated, checkParamsId],
    handler(patchComment, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deleteComment, (req, res, next) => ({
      ...req.params,
    }))
  );

// router
//   .route('/artwork/:artworkId/licenses/:licenseId')
//   .delete(isAuthenticated, artwork.deleteLicense);

export default router;
