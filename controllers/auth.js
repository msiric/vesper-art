import argon2 from "argon2";
import crypto from "crypto";
import createError from "http-errors";
import randomString from "randomstring";
import { isObjectEmpty } from "../common/helpers";
import {
  emailValidation,
  loginValidation,
  passwordValidation,
  signupValidation,
} from "../common/validation";
import { server } from "../config/secret.js";
import {
  addNewUser,
  editUserResetToken,
  logUserOut,
  refreshAccessToken,
  resetUserPassword,
  resetVerificationToken,
  revokeAccessToken,
} from "../services/postgres/auth.js";
import {
  fetchUserByAuth,
  fetchUserByToken,
  fetchUserIdByCreds,
  fetchUserIdByUsername,
} from "../services/postgres/user.js";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/auth.js";
import { sendEmail } from "../utils/email.js";
import { generateUuids, sanitizeData } from "../utils/helpers.js";

// needs transaction (not tested)
export const postSignUp = async ({
  userEmail,
  userUsername,
  userPassword,
  userConfirm,
  connection,
}) => {
  await signupValidation.validate(
    sanitizeData({
      userEmail,
      userUsername,
      userPassword,
      userConfirm,
    })
  );
  const userId = await fetchUserIdByCreds({
    userUsername,
    connection,
  });
  if (userId) {
    throw createError(400, "Account with that email/username already exists");
  } else {
    const verificationToken = randomString.generate();
    const verificationLink = `${server.clientDomain}/verify_token/${verificationToken}`;
    const hashedPassword = await argon2.hash(userPassword);
    const { userId } = generateUuids({
      userId: null,
    });
    await addNewUser({
      userId,
      userEmail,
      userUsername,
      hashedPassword,
      verificationToken,
      connection,
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
  connection,
}) => {
  await loginValidation.validate(sanitizeData({ userUsername, userPassword }));

  const userId = await fetchUserIdByUsername({
    userUsername,
    connection,
  });
  const foundUser = await fetchUserByAuth({ userId, connection });
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

export const postLogOut = ({ res, connection }) => {
  return logUserOut(res);
};

export const postRefreshToken = async ({ req, res, next, connection }) => {
  return await refreshAccessToken(req, res, next, connection);
};

export const postRevokeToken = async ({ userId, connection }) => {
  await revokeAccessToken({ userId, connection });
  return { message: "Token successfully revoked" };
};

// needs transaction (not tested)
export const verifyRegisterToken = async ({ tokenId, connection }) => {
  await resetVerificationToken({ tokenId, connection });
  return { message: "Token successfully verified" };
};

export const forgotPassword = async ({ userEmail, connection }) => {
  await emailValidation.validate(sanitizeData({ userEmail }));
  crypto.randomBytes(20, async function (err, buf) {
    const resetToken = buf.toString("hex");
    await editUserResetToken({ userEmail, resetToken, connection });
    await sendEmail({
      emailReceiver: userEmail,
      emailSubject: "Reset your password",
      emailContent: `You are receiving this because you have requested to reset the password for your account.
          Please click on the following link, or paste this into your browser to complete the process:
          
          <a href="${server.clientDomain}/reset_password/${resetToken}"</a>`,
    });
    return { message: "Password reset" };
  });
};

// needs transaction (not tested)
export const resetPassword = async ({
  tokenId,
  userCurrent,
  userPassword,
  userConfirm,
  connection,
}) => {
  const foundUser = await fetchUserByToken({ tokenId, connection });
  if (!isObjectEmpty(foundUser)) {
    const isCurrentValid = await argon2.verify(foundUser.password, userCurrent);
    if (!isCurrentValid)
      throw createError(400, "Current password is incorrect");
    const isPasswordValid = await argon2.verify(
      foundUser.password,
      userPassword
    );
    if (isPasswordValid)
      throw createError(400, "New password cannot be identical to the old one");
    await passwordValidation.validate(
      sanitizeData({
        userCurrent,
        userPassword,
        userConfirm,
      })
    );
    const hashedPassword = await argon2.hash(userPassword);
    await resetUserPassword({ tokenId, hashedPassword, connection });
    return { message: "Password updated successfully" };
  }
  throw createError(400, "Reset token is invalid or has expired");
};
