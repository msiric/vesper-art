import mongoose from "mongoose";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/auth.js";
import randomString from "randomstring";
import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import { server } from "../config/secret.js";
import {
  logUserOut,
  refreshAccessToken,
  revokeAccessToken,
  editUserResetToken,
  editUserVerification,
  addNewUser,
} from "../services/auth.js";
import signupValidator from "../validation/signup.js";
import loginValidator from "../validation/login.js";
import emailValidator from "../validation/email.js";
import resetValidator from "../validation/reset.js";
import { sanitizeData } from "../utils/helpers.js";
import { fetchUserByCreds, editUserPassword } from "../services/user.js";
import createError from "http-errors";

// needs transaction (not tested)
export const postSignUp = async ({
  email,
  username,
  password,
  confirm,
  session,
}) => {
  const { error } = signupValidator(
    sanitizeData({
      userEmail: email,
      userUsername: username,
      userPassword: password,
      confirmedPassword: confirm,
    })
  );
  if (error) throw createError(400, error);
  const foundUser = await fetchUserByCreds({ username, session });
  if (foundUser) {
    throw createError(400, "Account with that email/username already exists");
  } else {
    const token = randomString.generate();
    const link = `${server.clientDomain}/verify_token/${token}`;
    await addNewUser({ email, username, password, token, session });
    await sendEmail(
      server.appName,
      email,
      "Please confirm your email",
      `Hello,
        Please click on the link to verify your email:

        <a href=${link}>Click here to verify</a>`
    );
    return { message: "Verify your email address" };
  }
};

export const postLogIn = async ({ username, password, res, session }) => {
  const { error } = loginValidator(
    sanitizeData({ userUsername: username, userPassword: password })
  );
  if (error) throw createError(400, error);
  const foundUser = await fetchUserByCreds({ username, session });
  if (!foundUser) {
    throw createError(400, "Account with provided credentials does not exist");
  } else if (!foundUser.active) {
    throw createError(400, "This account is no longer active");
  } else if (!foundUser.verified) {
    throw createError(400, "Please verify your account");
  } else {
    const valid = bcrypt.compareSync(password, foundUser.password);

    if (!valid) {
      throw createError(
        400,
        "Account with provided credentials does not exist"
      );
    }

    const tokenPayload = {
      id: foundUser._id,
      name: foundUser.name,
      jwtVersion: foundUser.jwtVersion,
      onboarded: !!foundUser.stripeId,
      active: foundUser.active,
    };

    const userInfo = {
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      photo: foundUser.photo,
      messages: foundUser.inbox,
      notifications: foundUser.notifications,
      cart: foundUser.cart,
      saved: foundUser.savedArtwork,
      active: foundUser.active,
      stripeId: foundUser.stripeId,
      country: foundUser.country,
      jwtVersion: foundUser.jwtVersion,
    };

    sendRefreshToken(res, createRefreshToken(tokenPayload));

    return {
      accessToken: createAccessToken(tokenPayload),
      user: userInfo,
    };
  }
};

export const postLogOut = ({ res }) => {
  return logUserOut(res);
};

export const postRefreshToken = async ({ req, res, next }) => {
  return await refreshAccessToken(req, res, next);
};

export const postRevokeToken = async ({ userId }) => {
  await revokeAccessToken({ userId });
  return { message: "Token successfully revoked" };
};

// needs transaction (not tested)
export const verifyRegisterToken = async ({ tokenId }) => {
  await editUserVerification({ tokenId });
  return { message: "Token successfully verified" };
};

export const forgotPassword = async ({ email, session }) => {
  const { error } = emailValidator(sanitizeData({ userEmail: email }));
  if (error) throw createError(400, error);
  crypto.randomBytes(20, async function (err, buf) {
    const token = buf.toString("hex");
    await editUserResetToken({ email, token, session });
    await sendEmail(
      server.appName,
      email,
      "Reset your password",
      `You are receiving this because you have requested to reset the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        
        <a href="${server.clientDomain}/reset_password/${token}"</a>`
    );
    return { message: "Password reset" };
  });
};

// needs transaction (not tested)
export const resetPassword = async ({
  tokenId,
  password,
  confirm,
  session,
}) => {
  const { error } = resetValidator(
    sanitizeData({ newPassword: password, confirmedPassword: confirm })
  );
  if (error) throw createError(400, error);
  const updatedUser = await editUserPassword({ tokenId, password, session });
  await sendEmail(
    server.appName,
    updatedUser.email,
    "Password change",
    `You are receiving this because you just changed your password.
        
      If you did not request this, please contact us immediately.`
  );
  return { message: "Password reset" };
};
