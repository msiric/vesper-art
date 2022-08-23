import express from "express";
import { featureFlags } from "../../../common/constants";
import {
  createUserIntent,
  deactivateUser,
  deleteUserIntent,
  getUserProfile,
  getUserSettings,
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

export const router = express.Router();

// Public routes
router.route("/users/:userUsername").get(
  handler(getUserProfile, false, (req, res, next) => ({
    userUsername: req.params.userUsername,
  }))
);

// Authorized routes
router
  .route("/users/:userId")
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
  .delete(
    [isAuthenticated, isAuthorized],
    handler(deactivateUser, true, (req, res, next) => ({
      userId: req.params.userId,
      response: res,
    }))
  );

router
  .route("/users/:userId/settings")
  //
  .get(
    [isAuthenticated, isAuthorized],
    handler(getUserSettings, false, (req, res, next) => ({
      userId: req.params.userId,
    }))
  );

router.route("/users/:userId/preferences").patch(
  [isAuthenticated, isAuthorized],
  handler(updateUserPreferences, true, (req, res, next) => ({
    userId: req.params.userId,
    userFavorites: req.body.userFavorites,
  }))
);

router.route("/users/:userId/email").patch(
  [isAuthenticated, isAuthorized],
  handler(updateUserEmail, true, (req, res, next) => ({
    userId: req.params.userId,
    userEmail: req.body.userEmail,
    response: res,
  }))
);

router.route("/users/:userId/password").patch(
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
  router.route("/users/:userId/intents").post(
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
  router.route("/users/:userId/intents/:intentId").delete(
    [isAuthenticated, isAuthorized],
    handler(deleteUserIntent, true, (req, res, next) => ({
      userId: req.params.userId,
      intentId: req.params.intentId,
    }))
  );

export default router;
