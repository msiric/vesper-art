import express from "express";
import {
  forgotPassword,
  postLogIn,
  postLogOut,
  postRefreshToken,
  postRevokeToken,
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

// $TODO only for admin (remove in prod)
router
  .route("/revoke_token/:userId")
  // $TODO not tested
  .post(handler(postRevokeToken, true, (req, res, next) => ({})));

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
  .route("/reset_password/user/:userId/token/:tokenId")
  // $TODO not tested
  // implement check params token middleware?
  .post(
    [isNotAuthenticated],
    handler(resetPassword, true, (req, res, next) => ({
      ...req.params,
      ...req.body,
    }))
  );

router.route("/resend_token").post(
  isNotAuthenticated,
  handler(resendToken, true, (req, res, next) => ({
    ...req.body,
  }))
);

router.route("/update_email").post(
  isNotAuthenticated,
  handler(updateEmail, true, (req, res, next) => ({
    ...req.body,
  }))
);

export default router;
