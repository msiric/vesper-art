import express from "express";
import {
  deleteArtwork,
  favoriteArtwork,
  fetchArtworkFavorites,
  getArtwork,
  getArtworkComments,
  getArtworkDetails,
  getArtworkEdit,
  postNewArtwork,
  unfavoriteArtwork,
  updateArtwork,
} from "../../../controllers/artwork";
import {
  deleteComment,
  getComment,
  patchComment,
  postComment,
} from "../../../controllers/comment";
import multerApi from "../../../lib/multer";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers";

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
    handler(getArtworkDetails, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  )
  // $TODO not tested
  // OLD ROUTE WITH MEDIA UPLOAD INCLUDED
  /*   .patch(
    [isAuthenticated, multerApi.uploadArtworkLocal],
    handler(updateArtwork, true, (req, res, next) => ({
      ...req.params,
      artworkPath: req.file ? req.file.path : "",
      artworkFilename: req.file ? req.file.filename : "",
      artworkMimetype: req.file ? req.file.mimetype : "",
      artworkData: { ...req.body },
    }))
  ) */
  .patch(
    [isAuthenticated],
    handler(updateArtwork, true, (req, res, next) => ({
      ...req.params,
      artworkData: { ...req.body },
    }))
  )
  // $TODO not tested
  .delete(
    [isAuthenticated],
    handler(deleteArtwork, true, (req, res, next) => ({
      ...req.params,
    }))
  );

router.route("/artwork/:artworkId/edit").get(
  [isAuthenticated],
  handler(getArtworkEdit, false, (req, res, next) => ({
    ...req.params,
  }))
);

router
  .route("/artwork/:artworkId/comments")
  // $TODO not tested
  .get(
    handler(getArtworkComments, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  )
  // $DONE works
  .post(
    [isAuthenticated],
    handler(postComment, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/artwork/:artworkId/comments/:commentId")
  // $TODO not tested
  .get(
    handler(getComment, false, (req, res, next) => ({
      ...req.params,
    }))
  )
  // $DONE works
  .patch(
    [isAuthenticated],
    handler(patchComment, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  )
  // $DONE works
  .delete(
    [isAuthenticated],
    handler(deleteComment, true, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/artwork/:artworkId/favorites")
  .get(
    handler(fetchArtworkFavorites, false, (req, res, next) => ({
      ...req.params,
    }))
  )
  // $DONE works
  .post(
    [isAuthenticated],
    handler(favoriteArtwork, true, (req, res, next) => ({
      ...req.params,
    }))
  )
  // $DONE works
  .delete(
    [isAuthenticated],
    handler(unfavoriteArtwork, true, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

export default router;
