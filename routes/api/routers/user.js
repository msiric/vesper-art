import express from 'express';
import {
  isAuthenticated,
  checkParamsId,
  checkParamsUsername,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import user from '../../../controllers/user.js';

const router = express.Router();

router.route('/user/:username').get(
  checkParamsUsername,
  handler(user.getUserProfile, false, (req, res, next) => ({
    username: req.params.username,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/user/:userId/artwork').get(
  checkParamsId,
  handler(user.getUserArtwork, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/user/:userId/saves').get(
  checkParamsId,
  handler(user.getUserSaves, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router
  .route('/user/:userId')
  .patch(
    [isAuthenticated, checkParamsId],
    handler(user.updateUserProfile, true, (req, res, next) => ({
      userId: req.params.userId,
      userPhoto: req.body.userPhoto,
      userDescription: req.body.userDescription,
      userCountry: req.body.userCountry,
    }))
  )
  .delete(
    [isAuthenticated, checkParamsId],
    handler(user.deactivateUser, true, (req, res, next) => ({
      userId: req.params.userId,
    }))
  );

router.route('/user/:userId/statistics').get(
  [isAuthenticated, checkParamsId],
  handler(user.getUserSaves, false, (req, res, next) => ({
    userId: req.params.userId,
  }))
);

router.route('/user/:userId/sales').get(
  [isAuthenticated, checkParamsId],
  handler(user.getUserSales, false, (req, res, next) => ({
    userId: req.params.userId,
    from: req.query.from,
    to: req.query.to,
  }))
);

router.route('/user/:userId/purchases').get(
  [isAuthenticated, checkParamsId],
  handler(user.getUserPurchases, false, (req, res, next) => ({
    userId: req.params.userId,
    from: req.query.from,
    to: req.query.to,
  }))
);

router.route('/user/:userId/settings').get(
  [isAuthenticated, checkParamsId],
  handler(user.getUserSettings, false, (req, res, next) => ({
    userId: req.params.userId,
  }))
);

router.route('/user/:userId/preferences').patch(
  [isAuthenticated, checkParamsId],
  handler(user.updateUserPreferences, false, (req, res, next) => ({
    userId: req.params.userId,
    displaySaves: req.body.displaySaves,
  }))
);

router.route('/user/:userId/notifications').get(
  [isAuthenticated, checkParamsId],
  handler(user.getUserNotifications, false, (req, res, next) => ({
    userId: req.params.userId,
    cursor: req.query.cursor,
    ceiling: req.query.ceiling,
  }))
);

router.route('/user/:userId/update_email').patch(
  [isAuthenticated, checkParamsId],
  handler(user.updateUserEmail, true, (req, res, next) => ({
    userId: req.params.userId,
    email: req.body.email,
  }))
);

router.route('/user/:userId/update_password').patch(
  [isAuthenticated, checkParamsId],
  handler(user.updateUserPassword, false, (req, res, next) => ({
    userId: req.params.userId,
    current: req.body.current,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  }))
);

export default router;
