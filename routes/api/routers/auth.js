import express from 'express';
import {
  isAuthenticated,
  isNotAuthenticated,
  checkParamsId,
  requestHandler as handler,
} from '../../../utils/helpers.js';
import auth from '../../../controllers/auth.js';

const router = express.Router();

router.route('/signup').post(
  isNotAuthenticated,
  handler(auth.postSignUp, true, (req, res, next) => ({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    confirm: req.body.confirm,
  }))
);

router.route('/login').post(
  isNotAuthenticated,
  handler(auth.postLogIn, true, (req, res, next) => ({
    res,
    username: req.body.username,
    password: req.body.password,
  }))
);

// $TODO Bolje to treba
router.route('/logout').post(
  isAuthenticated,
  handler(auth.postLogOut, false, (req, res, next) => ({
    res,
  }))
);

// $TODO Bolje to treba
router.route('/refresh_token').post(
  handler(auth.postRefreshToken, false, (req, res, next) => ({
    req,
    res,
    next,
  }))
);

router.route('/revoke_token/:userId').post(
  checkParamsId,
  handler(auth.postRevokeToken, false, (req, res, next) => ({}))
);

router.route('/verify_token/:tokenId').get(
  isNotAuthenticated,
  handler(auth.verifyRegisterToken, false, (req, res, next) => ({
    tokenId: req.params.tokenId,
  }))
);

router.route('/forgot_password').post(
  isNotAuthenticated,
  handler(auth.forgotPassword, true, (req, res, next) => ({
    email: req.body.email,
  }))
);

router.route('/reset_password/:tokenId').post(
  [isNotAuthenticated, checkParamsId],
  handler(auth.resetPassword, true, (req, res, next) => ({
    tokenId: req.params.tokenId,
    password: req.body.password,
    confirm: req.body.confirm,
  }))
);

export default router;
