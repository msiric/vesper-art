import express from "express";
import { featureFlags } from "../../../common/constants";
import {
  createUserIntent,
  deactivateUser,
  deleteUserIntent,
  getBuyerStatistics,
  getLatestNotifications,
  getPreviousNotifications,
  getSellerStatistics,
  getUserArtworkById,
  getUserArtworkByUsername,
  getUserFavorites,
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
} from "../../../middleware/index";

const router = express.Router();

router.route("/users/:userUsername").get(
  handler(getUserProfile, false, (req, res, next) => ({
    userUsername: req.params.userUsername,
  }))
);

router
  .route("/users/:userId")
  // $DONE works
  .patch(
    [isAuthenticated, isAuthorized, multerApi.uploadUserLocal],
    handler(updateUserProfile, true, (req, res, next) => ({
      userId: req.params.userId,
      userDescription: req.body.userDescription,
      userCountry: req.body.userCountry,
      userPath: req.file ? req.file.path : "",
      userFilename: req.file ? req.file.filename : "",
      userMimetype: req.file ? req.file.mimetype : "",
    }))
  )
  // $TODO not tested
  .delete(
    [isAuthenticated, isAuthorized],
    handler(deactivateUser, true, (req, res, next) => ({
      userId: req.params.userId,
      response: res,
    }))
  );

router
  .route("/users/:userUsername/artwork")
  // $TODO not tested
  .get(
    handler(getUserArtworkByUsername, false, (req, res, next) => ({
      userUsername: req.params.userUsername,
      cursor: req.query.cursor,
      limit: req.query.limit,
    }))
  );

router
  .route("/users/:userUsername/favorites")
  // $TODO not tested
  .get(
    handler(getUserFavorites, false, (req, res, next) => ({
      userUsername: req.params.userUsername,
      cursor: req.query.cursor,
      limit: req.query.limit,
    }))
  );

router
  .route("/users/:userId/my_artwork")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserArtworkById, false, (req, res, next) => ({
      userId: req.params.userId,
      cursor: req.query.cursor,
      limit: req.query.limit,
    }))
  );

router
  .route("/users/:userId/uploads")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserUploads, false, (req, res, next) => ({
      userId: req.params.userId,
      cursor: req.query.cursor,
      limit: req.query.limit,
    }))
  );

router
  .route("/users/:userId/ownership")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserOwnership, false, (req, res, next) => ({
      userId: req.params.userId,
      cursor: req.query.cursor,
      limit: req.query.limit,
    }))
  );

// FEATURE FLAG - dashboard
featureFlags.dashboard &&
  router
    .route("/users/:userId/statistics/sales")
    // $TODO not tested
    .get(
      [isAuthenticated, isAuthorized],
      handler(getSellerStatistics, false, (req, res, next) => ({
        userId: req.params.userId,
      }))
    );

// FEATURE FLAG - dashboard
featureFlags.dashboard &&
  router
    .route("/users/:userId/statistics/purchases")
    // $TODO not tested
    .get(
      [isAuthenticated, isAuthorized],
      handler(getBuyerStatistics, false, (req, res, next) => ({
        userId: req.params.userId,
      }))
    );

// FEATURE FLAG - dashboard
featureFlags.dashboard &&
  router
    .route("/users/:userId/sales")
    // $TODO not tested
    .get(
      [isAuthenticated, isAuthorized],
      handler(getUserSales, false, (req, res, next) => ({
        userId: req.params.userId,
        start: req.query.start,
        end: req.query.end,
      }))
    );

// FEATURE FLAG - dashboard
featureFlags.dashboard &&
  router
    .route("/users/:userId/purchases")
    // $TODO not tested
    .get(
      [isAuthenticated, isAuthorized],
      handler(getUserPurchases, false, (req, res, next) => ({
        userId: req.params.userId,
        start: req.query.start,
        end: req.query.end,
      }))
    );

router
  .route("/users/:userId/settings")
  // $DONE works
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserSettings, false, (req, res, next) => ({
      userId: req.params.userId,
    }))
  );

router
  .route("/users/:userId/notifications/previous")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getPreviousNotifications, false, (req, res, next) => ({
      userId: req.params.userId,
      cursor: req.query.cursor,
      limit: req.query.limit,
    }))
  );

router
  .route("/users/:userId/notifications/latest")
  // $TODO not tested
  .get(
    [isAuthenticated, isAuthorized],
    handler(getLatestNotifications, false, (req, res, next) => ({
      userId: req.params.userId,
      cursor: req.query.cursor,
      limit: req.query.limit,
    }))
  );

router
  .route("/users/:userId/origin")
  // $TODO not tested
  .patch(
    [isAuthenticated, isAuthorized],
    handler(updateUserOrigin, true, (req, res, next) => ({
      userId: req.params.userId,
      userBusinessAddress: req.body.userBusinessAddress,
    }))
  );

router
  .route("/users/:userId/preferences")
  // $TODO not tested
  .patch(
    [isAuthenticated, isAuthorized],
    handler(updateUserPreferences, true, (req, res, next) => ({
      userId: req.params.userId,
      userFavorites: req.body.userFavorites,
    }))
  );

router
  .route("/users/:userId/email")
  // $TODO not tested
  .patch(
    [isAuthenticated, isAuthorized],
    handler(updateUserEmail, true, (req, res, next) => ({
      userId: req.params.userId,
      userEmail: req.body.userEmail,
      response: res,
    }))
  );

router
  .route("/users/:userId/password")
  // $TODO not tested
  .patch(
    [isAuthenticated, isAuthorized],
    handler(updateUserPassword, true, (req, res, next) => ({
      userId: req.params.userId,
      userCurrent: req.body.userCurrent,
      userPassword: req.body.userPassword,
      userConfirm: req.body.userConfirm,
    }))
  );

// $TODO no automated tests
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
        userId: req.params.userId,
        versionId: req.body.versionId,
        intentId: req.body.intentId,
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
        userId: req.params.userId,
        intentId: req.params.intentId,
      }))
    );

export default router;
