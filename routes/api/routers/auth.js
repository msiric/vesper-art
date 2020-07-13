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
  handler(isNotAuthenticated, false, (req, res, next) => (req, res, next)),
  handler(postSignUp, true, (req, res, next) => ({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    confirm: req.body.confirm,
  }))
);

router.route('/login').post(
  handler(isNotAuthenticated, false, (req, res, next) => (req, res, next)),
  handler(postLogIn, true, (req, res, next) => ({
    res,
    username: req.body.username,
    password: req.body.password,
  }))
);

// $TODO Bolje to treba
router.route('/logout').post(
  handler(isAuthenticated, false, (req, res, next) => (req, res, next)),
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
  handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  handler(postRevokeToken, false, (req, res, next) => ({}))
);

router.route('/verify_token/:tokenId').get(
  handler(isNotAuthenticated, false, (req, res, next) => (req, res, next)),
  handler(verifyRegisterToken, false, (req, res, next) => ({
    tokenId: req.params.tokenId,
  }))
);

router.route('/forgot_password').post(
  handler(isNotAuthenticated, false, (req, res, next) => (req, res, next)),
  handler(forgotPassword, true, (req, res, next) => ({
    email: req.body.email,
  }))
);

router.route('/reset_password/:tokenId').post(
  [
    handler(isNotAuthenticated, false, (req, res, next) => (req, res, next)),
    handler(checkParamsId, false, (req, res, next) => (req, res, next)),
  ],
  handler(resetPassword, true, (req, res, next) => ({
    tokenId: req.params.tokenId,
    password: req.body.password,
    confirm: req.body.confirm,
  }))
);

export default router;
