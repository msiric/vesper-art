import express from "express";
import {
  forgotPassword,
  postLogIn,
  postLogOut,
  postRefreshToken,
  postSignUp,
  resendToken,
  resetPassword,
  updateEmail,
  verifyRegisterToken,
} from "../../../controllers/auth";
import {
  isAuthenticated,
  isNotAuthenticated,
  requestHandler as handler,
} from "../../../middleware/index";

const router = express.Router();

// Public routes
router.route("/refresh_token").post(
  handler(postRefreshToken, true, (req, res, next) => ({
    cookies: req.cookies,
    response: res,
  }))
);

// $TODO only for admin (remove in prod)
// router
//   .route("/revoke_token/:userId")
//   // $TODO not tested
//   .post(handler(postRevokeToken, true, (req, res, next) => ({})));

// Unauthenticated routes
router.route("/signup").post(
  [isNotAuthenticated],
  handler(postSignUp, true, (req, res, next) => ({
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userUsername: req.body.userUsername,
    userPassword: req.body.userPassword,
    userConfirm: req.body.userConfirm,
  }))
);

router.route("/login").post(
  [isNotAuthenticated],
  handler(postLogIn, true, (req, res, next) => ({
    userUsername: req.body.userUsername,
    userPassword: req.body.userPassword,
    response: res,
  }))
);

router
  .route("/verify_token/:tokenId")
  //
  .get(
    [isNotAuthenticated],
    handler(verifyRegisterToken, true, (req, res, next) => ({
      tokenId: req.params.tokenId,
    }))
  );

router.route("/forgot_password").post(
  [isNotAuthenticated],
  handler(forgotPassword, true, (req, res, next) => ({
    userEmail: req.body.userEmail,
  }))
);

router.route("/reset_password/user/:userId/token/:tokenId").post(
  [isNotAuthenticated],
  handler(resetPassword, true, (req, res, next) => ({
    userId: req.params.userId,
    tokenId: req.params.tokenId,
    userPassword: req.body.userPassword,
    userConfirm: req.body.userConfirm,
  }))
);

router.route("/resend_token").post(
  [isNotAuthenticated],
  handler(resendToken, true, (req, res, next) => ({
    userEmail: req.body.userEmail,
  }))
);

router.route("/update_email").post(
  [isNotAuthenticated],
  handler(updateEmail, true, (req, res, next) => ({
    userEmail: req.body.userEmail,
    userUsername: req.body.userUsername,
    userPassword: req.body.userPassword,
  }))
);

// Authenticated routes
router.route("/logout").post(
  [isAuthenticated],
  handler(postLogOut, true, (req, res, next) => ({
    response: res,
  }))
);

export default router;
