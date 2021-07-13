import express from "express";
import { featureFlags } from "../../../common/constants";
import {
  createUserIntent,
  deactivateUser,
  deleteUserIntent,
  getBuyerStatistics,
  getSellerStatistics,
  getUserArtwork,
  getUserFavorites,
  getUserMedia,
  getUserNotifications,
  getUserOwnership,
  getUserProfile,
  getUserPurchases,
  getUserSales,
  getUserSettings,
  getUserUploads,
  updateUserEmail,
  updateUserOrigin,
  updateUserPassword,
  updateUserPreferences,
  updateUserProfile,
} from "../../../controllers/user";
import multerApi from "../../../lib/multer";
import {
  isAuthenticated,
  isAuthorized,
  requestHandler as handler,
} from "../../../utils/helpers";

const router = express.Router();

router
  .route("/users/:userUsername")
  // $DONE works
  .get(
    handler(getUserProfile, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId")
  // $DONE works
  .patch(
    [isAuthenticated, isAuthorized, multerApi.uploadUserLocal],
    handler(updateUserProfile, true, (req, res, next) => ({
      ...req.params,
      userPath: req.file ? req.file.path : "",
      userFilename: req.file ? req.file.filename : "",
      userMimetype: req.file ? req.file.mimetype : "",
      userData: { ...req.body },
    }))
  )
  // $TODO not tested
  .delete(
    [isAuthenticated, isAuthorized],
    handler(deactivateUser, true, (req, res, next) => ({
      response: res,
      ...req.params,
    }))
  );

router
  .route("/users/:userUsername/artwork")
  // $TODO not tested
  // $TODO needs authentication when going to my_artwork
  .get(
    handler(getUserArtwork, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userUsername/favorites")
  // $TODO not tested
  .get(
    handler(getUserFavorites, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/uploads")
  // $TODO not tested
  // $TODO needs authentication when going to my_artwork
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserUploads, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/artwork/:artworkId/download")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserMedia, false, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/ownership")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserOwnership, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/statistics/sales")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getSellerStatistics, false, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/statistics/purchases")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getBuyerStatistics, false, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/sales")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserSales, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/purchases")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserPurchases, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/settings")
  // $DONE works
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserSettings, false, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/notifications")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserNotifications, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/origin")
  // $TODO not tested
  .patch(
    [isAuthenticated, isAuthorized],
    handler(updateUserOrigin, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/preferences")
  // $TODO not tested
  .patch(
    [isAuthenticated, isAuthorized],
    handler(updateUserPreferences, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/email")
  // $TODO not tested
  .patch(
    [isAuthenticated, isAuthorized],
    handler(updateUserEmail, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
      response: res,
    }))
  );

router
  .route("/users/:userId/password")
  // $TODO not tested
  .patch(
    [isAuthenticated, isAuthorized],
    handler(updateUserPassword, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

// FEATURE FLAG - stripe
// FEATURE FLAG - payment
featureFlags.stripe &&
  featureFlags.payment &&
  router
    .route("/users/:userId/intents")
    // $TODO not tested
    .post(
      [isAuthenticated, isAuthorized],
      handler(createUserIntent, true, (req, res, next) => ({
        ...req.params,
        ...req.body,
      }))
    );

// FEATURE FLAG - stripe
// FEATURE FLAG - payment
featureFlags.stripe &&
  featureFlags.payment &&
  router
    .route("/users/:userId/intents/:intentId")
    // $TODO not tested
    .delete(
      [isAuthenticated, isAuthorized],
      handler(deleteUserIntent, true, (req, res, next) => ({
        ...req.params,
      }))
    );

export default router;
