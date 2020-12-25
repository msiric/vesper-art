import express from "express";
import {
  deleteArtwork,
  editArtwork,
  getArtwork,
  getArtworkComments,
  getArtworkDetails,
  getArtworkReviews,
  getLicenses,
  getUserArtwork,
  postNewArtwork,
  saveArtwork,
  saveLicense,
  unsaveArtwork,
  updateArtwork,
} from "../../../controllers/artwork.js";
import multerApi from "../../../lib/multer.js";
import {
  checkParamsId,
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router.route("/artwork").get(
  handler(getArtwork, (req, res, next) => ({
    ...req.query,
  }))
);

router.route("/artwork/:artworkId").get(
  checkParamsId,
  handler(getArtworkDetails, (req, res, next) => ({
    ...req.params,
    ...req.query,
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

// router
//   .route('/artwork/:artworkId/licenses/:licenseId')
//   .delete(isAuthenticated, artwork.deleteLicense);

router.route("/my_artwork").get(
  isAuthenticated,
  handler(getUserArtwork, (req, res, next) => ({
    ...req.query,
  }))
);

router.route("/add_artwork").post(
  [isAuthenticated, multerApi.uploadArtworkLocal],
  handler(postNewArtwork, (req, res, next) => ({
    artworkPath: req.file ? req.file.path : "",
    artworkFilename: req.file ? req.file.filename : "",
    artworkMimetype: req.file ? req.file.mimetype : "",
    artworkData: { ...req.body },
  }))
);

router
  .route("/edit_artwork/:artworkId")
  .get(
    [isAuthenticated, checkParamsId],
    handler(editArtwork, (req, res, next) => ({
      ...req.params,
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

router
  .route("/save_artwork/:artworkId")
  .post(
    [isAuthenticated, checkParamsId],
    handler(saveArtwork, (req, res, next) => ({
      ...req.params,
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(unsaveArtwork, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

export default router;
