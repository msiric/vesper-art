import express from 'express';
import { isAuthenticated, isNotAuthenticated } from '../../../utils/helpers.js';
import auth from '../../../controllers/auth.js';

const router = express.Router();

router.route('/signup').post(isNotAuthenticated, auth.postSignUp);

router.route('/login').post(isNotAuthenticated, auth.postLogIn);

router.route('/logout').post(isAuthenticated, auth.postLogOut);

router.route('/refresh_token').post(auth.postRefreshToken);

router.route('/revoke_token/:userId').post(auth.postRevokeToken);

router
  .route('/verify_token/:tokenId')
  .get(isNotAuthenticated, auth.verifyRegisterToken);

router.route('/forgot_password').post(isNotAuthenticated, auth.forgotPassword);

router
  .route('/reset_password/:tokenId')
  .post(isNotAuthenticated, auth.resetPassword);

export default router;
