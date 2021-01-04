import argon2 from "argon2";
import crypto from "crypto";
import createError from "http-errors";
import randomString from "randomstring";
import { server } from "../config/secret.js";
import {
  addNewUser,
  editUserResetToken,
  logUserOut,
  refreshAccessToken,
  resetRegisterToken,
  resetUserPassword,
  revokeAccessToken,
} from "../services/postgres/auth.js";
import {
  fetchUserByAuth,
  fetchUserIdByName,
} from "../services/postgres/user.js";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/auth.js";
import { sendEmail } from "../utils/email.js";
import { sanitizeData } from "../utils/helpers.js";
import emailValidator from "../validation/email.js";
import loginValidator from "../validation/login.js";
import resetValidator from "../validation/reset.js";
import signupValidator from "../validation/signup.js";

// needs transaction (not tested)
export const postSignUp = async ({
  userEmail,
  userUsername,
  userPassword,
  userConfirm,
  session,
}) => {
  const { error } = signupValidator(
    sanitizeData({
      userEmail,
      userUsername,
      userPassword,
      userConfirm,
    })
  );
  if (error) throw createError(400, error);
  const userId = await fetchUserIdByName({ userUsername, includeEmail: true });
  if (userId) {
    throw createError(400, "Account with that email/username already exists");
  } else {
    const verificationToken = randomString.generate();
    const verificationLink = `${server.clientDomain}/verify_token/${verificationToken}`;
    const hashedPassword = await argon2.hash(userPassword);
    await addNewUser({
      userEmail,
      userUsername,
      hashedPassword,
      verificationToken,
      session,
    });
    await sendEmail({
      emailReceiver: userEmail,
      emailSubject: "Please confirm your email",
      emailContent: `Hello,
        Please click on the link to verify your email:

        <a href=${verificationLink}>Click here to verify</a>`,
    });
    return { message: "Verify your email address" };
  }
};

export const postLogIn = async ({
  userUsername,
  userPassword,
  res,
  session,
}) => {
  const { error } = loginValidator(
    sanitizeData({ userUsername, userPassword })
  );
  if (error) throw createError(400, error);

  const userId = await fetchUserIdByName({ userUsername, includeEmail: true });
  const foundUser = await fetchUserByAuth({ userId });
  if (!foundUser) {
    throw createError(400, "Account with provided credentials does not exist");
  } else if (!foundUser.active) {
    throw createError(400, "This account is no longer active");
  } else if (!foundUser.verified) {
    throw createError(400, "Please verify your account");
  } else {
    const valid = await argon2.verify(foundUser.password, userPassword);

    if (!valid) {
      throw createError(
        400,
        "Account with provided credentials does not exist"
      );
    }
  }

  const tokenPayload = {
    id: foundUser.id,
    name: foundUser.name,
    jwtVersion: foundUser.jwtVersion,
    onboarded: !!foundUser.stripeId,
    active: foundUser.active,
  };

  const userInfo = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    avatar: foundUser.avatar,
    notifications: foundUser.notifications,
    active: foundUser.active,
    stripeId: foundUser.stripeId,
    country: foundUser.country,
    businessAddress: foundUser.businessAddress,
    jwtVersion: foundUser.jwtVersion,
    favorites: foundUser.favorites,
    intents: foundUser.intents,
  };

  sendRefreshToken(res, createRefreshToken({ userData: tokenPayload }));

  return {
    accessToken: createAccessToken({ userData: tokenPayload }),
    user: userInfo,
  };
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
  await resetRegisterToken({ tokenId });
  return { message: "Token successfully verified" };
};

export const forgotPassword = async ({ userEmail, session }) => {
  const { error } = emailValidator(sanitizeData({ userEmail }));
  if (error) throw createError(400, error);
  crypto.randomBytes(20, async function (err, buf) {
    const resetToken = buf.toString("hex");
    await editUserResetToken({ userEmail, resetToken, session });
    await sendEmail({
      emailReceiver: userEmail,
      emailSubject: "Reset your password",
      emailContent: `You are receiving this because you have requested to reset the password for your account.
          Please click on the following link, or paste this into your browser to complete the process:
          
          <a href="${server.clientDomain}/reset_password/${token}"</a>`,
    });
    return { message: "Password reset" };
  });
};

// needs transaction (not tested)
export const resetPassword = async ({
  tokenId,
  userPassword,
  userConfirm,
  session,
}) => {
  const { error } = resetValidator(sanitizeData({ userPassword, userConfirm }));
  if (error) throw createError(400, error);
  const hashedPassword = await argon2.hash(userPassword);
  const updatedUser = await resetUserPassword({
    tokenId,
    hashedPassword,
    session,
  });
  await sendEmail({
    emailReceiver: updatedUser.email,
    emailSubject: "Password change",
    emailContent: `You are receiving this because you just changed your password.
        
      If you did not request this, please contact us immediately.`,
  });
  return { message: "Password reset" };
};
