import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  checkParamsUsername,
  requestHandler as handler,
} from '../../../utils/helpers.js';
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
  getUserStatistics,
  updateUserOrigin,
} from '../../../controllers/user.js';

const router = express.Router();

router.route('/user/:userUsername').get(
  checkParamsUsername,
  handler(getUserProfile, false, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route('/user/:userId/artwork').get(
  checkParamsId,
  handler(getUserArtwork, false, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route('/user/:userId/saves').get(
  checkParamsId,
  handler(getUserSaves, false, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router
  .route('/user/:userId')
  .patch(
    [isAuthenticated, checkParamsId],
    handler(updateUserProfile, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(deactivateUser, true, (req, res, next) => ({
      ...req.params,
    }))
  );

router.route('/user/:userId/origin').patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserOrigin, false, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route('/user/:userId/statistics').get(
  [isAuthenticated, checkParamsId],
  handler(getUserStatistics, false, (req, res, next) => ({
    ...req.params,
  }))
);

router.route('/user/:userId/sales').get(
  [isAuthenticated, checkParamsId],
  handler(getUserSales, false, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route('/user/:userId/purchases').get(
  [isAuthenticated, checkParamsId],
  handler(getUserPurchases, false, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route('/user/:userId/settings').get(
  [isAuthenticated, checkParamsId],
  handler(getUserSettings, false, (req, res, next) => ({
    ...req.params,
  }))
);

router.route('/user/:userId/preferences').patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserPreferences, false, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route('/user/:userId/notifications').get(
  [isAuthenticated, checkParamsId],
  handler(getUserNotifications, false, (req, res, next) => ({
    ...req.params,
    ...req.query,
  }))
);

router.route('/user/:userId/update_email').patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserEmail, true, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

router.route('/user/:userId/update_password').patch(
  [isAuthenticated, checkParamsId],
  handler(updateUserPassword, false, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

export default router;
