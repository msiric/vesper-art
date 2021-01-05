import express from "express";
import {
  deleteArtwork,
  favoriteArtwork,
  getArtwork,
  getArtworkComments,
  getArtworkDetails,
  postNewArtwork,
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
  // $DONE works
  .get(
    handler(getArtwork, false, (req, res, next) => ({
      ...req.query,
    }))
  )
  // $DONE works
  .post(
    [isAuthenticated, multerApi.uploadArtworkLocal],
    handler(postNewArtwork, true, (req, res, next) => ({
      artworkPath: req.file ? req.file.path : "",
      artworkFilename: req.file ? req.file.filename : "",
      artworkMimetype: req.file ? req.file.mimetype : "",
      artworkData: { ...req.body },
    }))
  );

router
  .route("/artwork/:artworkId")
  // $DONE works (NOTE needs to return number of favorites instead of array)
  .get(
    checkParamsId,
    handler(getArtworkDetails, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  )
  // $TODO not tested
  .patch(
    [isAuthenticated, checkParamsId, multerApi.uploadArtworkLocal],
    handler(updateArtwork, true, (req, res, next) => ({
      ...req.params,
      artworkPath: req.file ? req.file.path : "",
      artworkFilename: req.file ? req.file.filename : "",
      artworkMimetype: req.file ? req.file.mimetype : "",
      artworkData: { ...req.body },
    }))
  )
  // $TODO not tested
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deleteArtwork, true, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/artwork/:artworkId/comments")
  // $TODO not tested
  .get(
    checkParamsId,
    handler(getArtworkComments, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  )
  // $DONE works
  .post(
    [isAuthenticated, checkParamsId],
    handler(postComment, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/artwork/:artworkId/comments/:commentId")
  // $TODO not tested
  .get(
    [isAuthenticated, checkParamsId],
    handler(getComment, false, (req, res, next) => ({
      ...req.params,
    }))
  )
  // $DONE works
  .patch(
    [isAuthenticated, checkParamsId],
    handler(patchComment, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  )
  // $DONE works
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deleteComment, true, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/artwork/:artworkId/favorites")
  // $DONE works
  .post(
    [isAuthenticated, checkParamsId],
    handler(favoriteArtwork, true, (req, res, next) => ({
      ...req.params,
    }))
  )
  // $DONE works
  .delete(
    [isAuthenticated, checkParamsId],
    handler(unfavoriteArtwork, true, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

export default router;
