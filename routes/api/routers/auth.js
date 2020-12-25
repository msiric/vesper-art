import express from "express";
import {
  forgotPassword,
  postLogIn,
  postLogOut,
  postRefreshToken,
  postRevokeToken,
  postSignUp,
  resetPassword,
  verifyRegisterToken,
} from "../../../controllers/auth.js";
import {
  checkParamsId,
  isAuthenticated,
  isNotAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router.route("/signup").post(
  isNotAuthenticated,
  handler(postSignUp, (req, res, next) => ({
    ...req.body,
  }))
);

router.route("/login").post(
  isNotAuthenticated,
  handler(postLogIn, (req, res, next) => ({
    res,
    ...req.body,
  }))
);

// $TODO Bolje to treba
router.route("/logout").post(
  isAuthenticated,
  handler(postLogOut, (req, res, next) => ({
    res,
  }))
);

// $TODO Bolje to treba
router.route("/refresh_token").post(
  handler(postRefreshToken, (req, res, next) => ({
    req,
    res,
    next,
  }))
);

router.route("/revoke_token/:userId").post(
  checkParamsId,
  handler(postRevokeToken, (req, res, next) => ({}))
);

router.route("/verify_token/:tokenId").get(
  isNotAuthenticated,
  handler(verifyRegisterToken, (req, res, next) => ({
    ...req.params,
  }))
);

router.route("/forgot_password").post(
  isNotAuthenticated,
  handler(forgotPassword, (req, res, next) => ({
    ...req.body,
  }))
);

router.route("/reset_password/:tokenId").post(
  [isNotAuthenticated, checkParamsId],
  handler(resetPassword, (req, res, next) => ({
    ...req.params,
    ...req.body,
  }))
);

export default router;
