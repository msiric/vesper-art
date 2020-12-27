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

router.route("/users/:userUsername").get(
  checkParamsUsername,
  handler(getUserProfile, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router
  .route("/users/:userId")
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
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deactivateUser, (req, res, next) => ({
      ...req.params,
    }))
  );

router.route("/users/:userId/artwork").get(
  checkParamsId,
  handler(getUserArtwork, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/users/:userId/artwork/:artworkId/download").get(
  [isAuthenticated, checkParamsId],
  handler(getUserMedia, (req, res, next) => ({
    ...req.params,
  }))
);

router.route("/users/:userId/ownership").get(
  checkParamsId,
  handler(getUserOwnership, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/users/:userId/favorites").get(
  checkParamsId,
  handler(getUserFavorites, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/users/:userId/statistics").get(
  [isAuthenticated, checkParamsId],
  handler(getUserStatistics, (req, res, next) => ({
    ...req.params,
  }))
);

router.route("/users/:userId/sales").get(
  [isAuthenticated, checkParamsId],
  handler(getUserSales, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/users/:userId/purchases").get(
  [isAuthenticated, checkParamsId],
  handler(getUserPurchases, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/users/:userId/settings").get(
  [isAuthenticated, checkParamsId],
  handler(getUserSettings, (req, res, next) => ({
    ...req.params,
  }))
);

router.route("/users/:userId/notifications").get(
  [isAuthenticated, checkParamsId],
  handler(getUserNotifications, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/users/:userId/origin").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserOrigin, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/users/:userId/preferences").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserPreferences, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/users/:userId/email").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserEmail, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/users/:userId/password").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserPassword, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/users/:userId/intents").post(
  [isAuthenticated, checkParamsId],
  handler(createUserIntent, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/users/:userId/intents/:intentId").delete(
  [isAuthenticated, checkParamsId],
  handler(deleteUserIntent, (req, res, next) => ({
    ...req.params,
  }))
);

export default router;
