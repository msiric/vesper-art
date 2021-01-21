import express from "express";
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
  updateUserEmail,
  updateUserOrigin,
  updateUserPassword,
  updateUserPreferences,
  updateUserProfile,
} from "../../../controllers/user.js";
import multerApi from "../../../lib/multer.js";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

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
    [isAuthenticated, multerApi.uploadUserLocal],
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
    [isAuthenticated],
    handler(deactivateUser, true, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/artwork")
  // $TODO not tested
  .get(
    handler(getUserArtwork, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/artwork/:artworkId/download")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getUserMedia, false, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/ownership")
  // $TODO not tested
  .get(
    handler(getUserOwnership, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/favorites")
  // $TODO not tested
  .get(
    handler(getUserFavorites, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/statistics/sales")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getSellerStatistics, false, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/statistics/purchases")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getBuyerStatistics, false, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/sales")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getUserSales, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/purchases")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getUserPurchases, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/settings")
  // $DONE works
  .get(
    [isAuthenticated],
    handler(getUserSettings, false, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/users/:userId/notifications")
  // $TODO not tested
  .get(
    [isAuthenticated],
    handler(getUserNotifications, false, (req, res, next) => ({
      ...req.params,
      ...req.query,
    }))
  );

router
  .route("/users/:userId/origin")
  // $TODO not tested
  .patch(
    [isAuthenticated],
    handler(updateUserOrigin, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/preferences")
  // $TODO not tested
  .patch(
    [isAuthenticated],
    handler(updateUserPreferences, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/email")
  // $TODO not tested
  .patch(
    [isAuthenticated],
    handler(updateUserEmail, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/password")
  // $TODO not tested
  .patch(
    [isAuthenticated],
    handler(updateUserPassword, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/intents")
  // $TODO not tested
  .post(
    [isAuthenticated],
    handler(createUserIntent, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router
  .route("/users/:userId/intents/:intentId")
  // $TODO not tested
  .delete(
    [isAuthenticated],
    handler(deleteUserIntent, true, (req, res, next) => ({
      ...req.params,
    }))
  );

export default router;
