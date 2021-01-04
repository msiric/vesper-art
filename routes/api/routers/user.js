import express from "express";
import {
  createUserIntent,
  deactivateUser,
  deleteUserIntent,
  getUserArtwork,
  getUserFavorites,
  getUserMedia,
  getUserNotifications,
  getUserOwnership,
  getUserProfile,
  getUserPurchases,
  getUserSales,
  getUserSettings,
  getUserStatistics,
  updateUserEmail,
  updateUserOrigin,
  updateUserPassword,
  updateUserPreferences,
  updateUserProfile,
} from "../../../controllers/user.js";
import multerApi from "../../../lib/multer.js";
import {
  checkParamsId,
  checkParamsUsername,
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router
  .route("/users/:userUsername")
  // $DONE works
  .get(
    checkParamsUsername,
    handler(getUserProfile, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId")
  // $DONE works
  .patch(
    [isAuthenticated, checkParamsId, multerApi.uploadUserLocal],
    handler(updateUserProfile, (req, res, next) => ({
      ...req.params,
      userPath: req.file ? req.file.path : "",
      userFilename: req.file ? req.file.filename : "",
      userMimetype: req.file ? req.file.mimetype : "",
      userData: { ...req.body },
    }))
  )
  // $TODO not tested
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deactivateUser, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/artwork")
  // $TODO not tested
  .get(
    checkParamsId,
    handler(getUserArtwork, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/artwork/:artworkId/download")
  // $TODO not tested
  .get(
    [isAuthenticated, checkParamsId],
    handler(getUserMedia, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/ownership")
  // $TODO not tested
  .get(
    checkParamsId,
    handler(getUserOwnership, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/favorites")
  // $TODO not tested
  .get(
    checkParamsId,
    handler(getUserFavorites, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/statistics")
  // $TODO not tested
  .get(
    [isAuthenticated, checkParamsId],
    handler(getUserStatistics, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/sales")
  // $TODO not tested
  .get(
    [isAuthenticated, checkParamsId],
    handler(getUserSales, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/purchases")
  // $TODO not tested
  .get(
    [isAuthenticated, checkParamsId],
    handler(getUserPurchases, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/settings")
  // $DONE works
  .get(
    [isAuthenticated, checkParamsId],
    handler(getUserSettings, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/notifications")
  // $TODO not tested
  .get(
    [isAuthenticated, checkParamsId],
    handler(getUserNotifications, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/origin")
  // $TODO not tested
  .patch(
    [isAuthenticated, checkParamsId],
    handler(updateUserOrigin, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/preferences")
  // $TODO not tested
  .patch(
    [isAuthenticated, checkParamsId],
    handler(updateUserPreferences, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/email")
  // $TODO not tested
  .patch(
    [isAuthenticated, checkParamsId],
    handler(updateUserEmail, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/password")
  // $TODO not tested
  .patch(
    [isAuthenticated, checkParamsId],
    handler(updateUserPassword, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/intents")
  // $TODO not tested
  .post(
    [isAuthenticated, checkParamsId],
    handler(createUserIntent, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/intents/:intentId")
  // $TODO not tested
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deleteUserIntent, (req, res, next) => ({
      ...req.params,
    }))
  );

export default router;
