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

router
  .route("/signup")
  // $DONE works
  .post(
    isNotAuthenticated,
    handler(postSignUp, true, (req, res, next) => ({
      ...req.body,
    }))
  );

router
  .route("/login")
  // $DONE works
  .post(
    isNotAuthenticated,
    handler(postLogIn, true, (req, res, next) => ({
      res,
      ...req.body,
    }))
  );

// $TODO Bolje to treba
router
  .route("/logout")
  // $DONE works
  .post(
    isAuthenticated,
    handler(postLogOut, true, (req, res, next) => ({
      res,
    }))
  );

// $TODO Bolje to treba
router
  .route("/refresh_token")
  // $DONE works
  .post(
    handler(postRefreshToken, true, (req, res, next) => ({
      req,
      res,
      next,
    }))
  );

router
  .route("/revoke_token/:userId")
  // $TODO not tested
  .post(
    checkParamsId,
    handler(postRevokeToken, true, (req, res, next) => ({}))
  );

router
  .route("/verify_token/:tokenId")
  // $DONE works
  .get(
    isNotAuthenticated,
    handler(verifyRegisterToken, true, (req, res, next) => ({
      ...req.params,
    }))
  );

router
  .route("/forgot_password")
  // $TODO not tested
  .post(
    isNotAuthenticated,
    handler(forgotPassword, true, (req, res, next) => ({
      ...req.body,
    }))
  );

router
  .route("/reset_password/:tokenId")
  // $TODO not tested
  // implement check params token middleware?
  .post(
    handler(resetPassword, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

export default router;
