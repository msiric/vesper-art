import express from 'express';
import {
  isAuthenticated,
  isNotAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import {
  postSignUp,
  postLogIn,
  postLogOut,
  postRefreshToken,
  postRevokeToken,
  verifyRegisterToken,
  forgotPassword,
  resetPassword,
} from '../../../controllers/auth.js';

const router = express.Router();

router.route('/signup').post(
  isNotAuthenticated,
  handler(postSignUp, true, (req, res, next) => ({
    ...req.body,
  }))
);

router.route('/login').post(
  isNotAuthenticated,
  handler(postLogIn, true, (req, res, next) => ({
    res,
    ...req.body,
  }))
);

// $TODO Bolje to treba
router.route('/logout').post(
  isAuthenticated,
  handler(postLogOut, false, (req, res, next) => ({
    res,
  }))
);

// $TODO Bolje to treba
router.route('/refresh_token').post(
  handler(postRefreshToken, false, (req, res, next) => ({
    req,
    res,
    next,
  }))
);

router.route('/revoke_token/:userId').post(
  checkParamsId,
  handler(postRevokeToken, false, (req, res, next) => ({}))
);

router.route('/verify_token/:tokenId').get(
  isNotAuthenticated,
  handler(verifyRegisterToken, false, (req, res, next) => ({
    ...req.params,
  }))
);

router.route('/forgot_password').post(
  isNotAuthenticated,
  handler(forgotPassword, true, (req, res, next) => ({
    ...req.body,
  }))
);

router.route('/reset_password/:tokenId').post(
  [isNotAuthenticated, checkParamsId],
  handler(resetPassword, true, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

export default router;
