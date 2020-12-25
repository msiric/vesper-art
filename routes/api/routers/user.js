import express from "express";
import {
  createUserIntent,
  deactivateUser,
  deleteUserIntent,
  getUserArtwork,
  getUserMedia,
  getUserNotifications,
  getUserOwnership,
  getUserProfile,
  getUserPurchases,
  getUserSales,
  getUserSaves,
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

router.route("/user/:userUsername").get(
  checkParamsUsername,
  handler(getUserProfile, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/user/:userId/artwork").get(
  checkParamsId,
  handler(getUserArtwork, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/user/:userId/ownership").get(
  checkParamsId,
  handler(getUserOwnership, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/user/:userId/saves").get(
  checkParamsId,
  handler(getUserSaves, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router
  .route("/user/:userId")
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

router.route("/user/:userId/origin").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserOrigin, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/user/:userId/statistics").get(
  [isAuthenticated, checkParamsId],
  handler(getUserStatistics, (req, res, next) => ({
    ...req.params,
  }))
);

router.route("/user/:userId/sales").get(
  [isAuthenticated, checkParamsId],
  handler(getUserSales, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/user/:userId/purchases").get(
  [isAuthenticated, checkParamsId],
  handler(getUserPurchases, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/user/:userId/settings").get(
  [isAuthenticated, checkParamsId],
  handler(getUserSettings, (req, res, next) => ({
    ...req.params,
  }))
);

router.route("/user/:userId/preferences").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserPreferences, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/user/:userId/notifications").get(
  [isAuthenticated, checkParamsId],
  handler(getUserNotifications, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route("/user/:userId/update_email").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserEmail, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/user/:userId/update_password").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserPassword, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/user/:userId/intents").post(
  [isAuthenticated, checkParamsId],
  handler(createUserIntent, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route("/user/:userId/intents/:intentId").delete(
  [isAuthenticated, checkParamsId],
  handler(deleteUserIntent, (req, res, next) => ({
    ...req.params,
  }))
);

router.route("/user/:userId/artwork/:artworkId/download").get(
  [isAuthenticated, checkParamsId],
  handler(getUserMedia, (req, res, next) => ({
    ...req.params,
  }))
);

export default router;
