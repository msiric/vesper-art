import express from 'express';
import { isAuthenticated } from '../../../utils/helpers.js';
import user from '../../../controllers/user.js';

const router = express.Router();

router.route('/user/:userName').get(user.getUserProfile);

router.route('/user/:userId/artwork').get(user.getUserArtwork);

router.route('/user/:userId/saves').get(user.getUserSaves);

router
  .route('/user/:userId')
  .patch(isAuthenticated, user.updateUserProfile)
  .delete(isAuthenticated, user.deactivateUser);

router
  .route('/user/:userId/statistics')
  .get(isAuthenticated, user.getUserStatistics);

router.route('/user/:userId/sales').get(isAuthenticated, user.getUserSales);

router
  .route('/user/:userId/purchases')
  .get(isAuthenticated, user.getUserPurchases);

router
  .route('/user/:userId/settings')
  .get(isAuthenticated, user.getUserSettings);

router
  .route('/user/:userId/preferences')
  .patch(isAuthenticated, user.updateUserPreferences);

router
  .route('/user/:userId/notifications')
  .get(isAuthenticated, user.getUserNotifications);

router
  .route('/user/:userId/update_email')
  .patch(isAuthenticated, user.updateUserEmail);

router
  .route('/user/:userId/update_password')
  .patch(isAuthenticated, user.updateUserPassword);

export default router;
