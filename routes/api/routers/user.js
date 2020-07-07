import express from "express";
import {
  isAuthenticated,
  checkParamsId,
  checkParamsUsername,
  requestHandler as handler,
} from "../../../utils/helpers.js";
import {
  getUserProfile,
  getUserArtwork,
  updateUserProfile,
  deactivateUser,
  getUserSaves,
  getUserSales,
  getUserPurchases,
  getUserSettings,
  updateUserPreferences,
  getUserNotifications,
  updateUserEmail,
  updateUserPassword,
} from "../../../controllers/user.js";

const router = express.Router();

router.route("/user/:username").get(
  checkParamsUsername,
  handler(getUserProfile, false, (req, res, next) => ({
    username: req.params.username,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route("/user/:userId/artwork").get(
  checkParamsId,
  handler(getUserArtwork, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route("/user/:userId/saves").get(
  checkParamsId,
  handler(getUserSaves, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router
  .route("/user/:userId")
  .patch(
    [isAuthenticated, checkParamsId],
    handler(updateUserProfile, true, (req, res, next) => ({
      userId: req.params.userId,
      userMedia: req.body.userMedia,
      userDescription: req.body.userDescription,
      userCountry: req.body.userCountry,
      userDimensions: req.body.userDimensions,
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deactivateUser, true, (req, res, next) => ({
      userId: req.params.userId,
    }))
  );

router.route("/user/:userId/statistics").get(
  [isAuthenticated, checkParamsId],
  handler(getUserSaves, false, (req, res, next) => ({
    userId: req.params.userId,
  }))
);

router.route("/user/:userId/sales").get(
  [isAuthenticated, checkParamsId],
  handler(getUserSales, false, (req, res, next) => ({
    userId: req.params.userId,
    from: req.query.from,
    to: req.query.to,
  }))
);

router.route("/user/:userId/purchases").get(
  [isAuthenticated, checkParamsId],
  handler(getUserPurchases, false, (req, res, next) => ({
    userId: req.params.userId,
    from: req.query.from,
    to: req.query.to,
  }))
);

router.route("/user/:userId/settings").get(
  [isAuthenticated, checkParamsId],
  handler(getUserSettings, false, (req, res, next) => ({
    userId: req.params.userId,
  }))
);

router.route("/user/:userId/preferences").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserPreferences, false, (req, res, next) => ({
    userId: req.params.userId,
    displaySaves: req.body.displaySaves,
  }))
);

router.route("/user/:userId/notifications").get(
  [isAuthenticated, checkParamsId],
  handler(getUserNotifications, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route("/user/:userId/update_email").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserEmail, true, (req, res, next) => ({
    userId: req.params.userId,
    email: req.body.email,
  }))
);

router.route("/user/:userId/update_password").patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserPassword, false, (req, res, next) => ({
    userId: req.params.userId,
    current: req.body.current,
    password: req.body.password,
    confirm: req.body.confirm,
  }))
);

export default router;
