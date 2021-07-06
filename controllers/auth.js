import argon2 from "argon2";
import createError from "http-errors";
import { isObjectEmpty } from "../common/helpers";
import {
  emailValidation,
  loginValidation,
  passwordValidation,
  recoveryValidation,
  signupValidation,
} from "../common/validation";
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
  editUserEmail,
  fetchUserByAuth,
  fetchUserByEmail,
  fetchUserByResetToken,
  fetchUserIdByCreds,
  fetchUserIdByEmail,
  fetchUserIdByUsername,
  fetchUserIdByVerificationToken,
} from "../services/postgres/user.js";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/auth.js";
import { sendEmail } from "../utils/email.js";
import {
  formatError,
  formatResponse,
  generateResetToken,
  generateUuids,
  generateVerificationToken,
} from "../utils/helpers.js";
import { errors, responses } from "../utils/statuses";

// needs transaction (not tested)
export const postSignUp = async ({
  userEmail,
  userUsername,
  userPassword,
  userConfirm,
  connection,
}) => {
  await signupValidation.validate({
    userEmail,
    userUsername,
    userPassword,
    userConfirm,
  });
  const foundId = await fetchUserIdByCreds({
    userUsername,
    connection,
  });
  if (foundId) {
    throw createError(...formatError(errors.userAlreadyExists));
  } else {
    const { verificationToken, verificationLink, verificationExpiry } =
      generateVerificationToken();
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
      verificationExpiry,
      connection,
    });
    await sendEmail({
      emailReceiver: userEmail,
      emailSubject: "Please confirm your email",
      emailContent: `Hello,
        Please click on the link to verify your email:

        <a href=${verificationLink}>Click here to verify</a>`,
    });
    return formatResponse(responses.userSignedUp);
  }
};

export const postLogIn = async ({
  userUsername,
  userPassword,
  res,
  connection,
}) => {
  await loginValidation.validate({ userUsername, userPassword });

  const foundId = await fetchUserIdByUsername({
    userUsername,
    connection,
  });
  if (foundId) {
    const foundUser = await fetchUserByAuth({ userId: foundId, connection });

    if (isObjectEmpty(foundUser)) {
      throw createError(...formatError(errors.userDoesNotExist));
    } else if (!foundUser.active) {
      throw createError(...formatError(errors.userNoLongerActive));
    } else if (!foundUser.verified) {
      throw createError(...formatError(errors.userNotVerified));
    } else {
      const isValid = await argon2.verify(foundUser.password, userPassword);

      if (!isValid) {
        throw createError(...formatError(errors.userDoesNotExist));
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
  }
  throw createError(...formatError(errors.userDoesNotExist));
};

export const postLogOut = ({ res, connection }) => {
  return logUserOut(res);
};

export const postRefreshToken = async ({ req, res, next, connection }) => {
  return await refreshAccessToken(req, res, next, connection);
};

export const postRevokeToken = async ({ userId, connection }) => {
  await revokeAccessToken({ userId, connection });
  return formatResponse(responses.accessTokenRevoked);
};

// needs transaction (not tested)
export const verifyRegisterToken = async ({ tokenId, connection }) => {
  const foundId = await fetchUserIdByVerificationToken({ tokenId, connection });
  if (foundId) {
    await resetVerificationToken({ tokenId, connection });
    return formatResponse(responses.registerTokenVerified);
  }
  throw createError(...formatError(errors.verificationTokenInvalid));
};

export const forgotPassword = async ({ userEmail, connection }) => {
  await emailValidation.validate({ userEmail });
  const { resetToken, resetLink, resetExpiry } = generateResetToken();
  await editUserResetToken({
    userEmail,
    resetToken,
    resetExpiry,
    connection,
  });
  await sendEmail({
    emailReceiver: userEmail,
    emailSubject: "Reset your password",
    emailContent: `You are receiving this because you have requested to reset the password for your account.
          Please click on the following link, or paste this into your browser to complete the process:
          
          <a href="${resetLink}"</a>`,
  });
  return formatResponse(responses.passwordReset);
};

// needs transaction (not tested)
export const resetPassword = async ({
  tokenId,
  userCurrent,
  userPassword,
  userConfirm,
  connection,
}) => {
  const foundUser = await fetchUserByResetToken({ tokenId, connection });
  if (!isObjectEmpty(foundUser)) {
    const isCurrentValid = await argon2.verify(foundUser.password, userCurrent);
    if (!isCurrentValid)
      throw createError(...formatError(errors.currentPasswordIncorrect));
    const isPasswordValid = await argon2.verify(
      foundUser.password,
      userPassword
    );
    if (isPasswordValid)
      throw createError(...formatError(errors.newPasswordIdentical));
    await passwordValidation.validate({
      userCurrent,
      userPassword,
      userConfirm,
    });
    const hashedPassword = await argon2.hash(userPassword);
    await resetUserPassword({ tokenId, hashedPassword, connection });
    return formatResponse(responses.passwordUpdated);
  }
  throw createError(...formatError(errors.resetTokenInvalid));
};

export const resendToken = async ({ userEmail, connection }) => {
  await emailValidation.validate({
    userEmail,
  });
  const foundUser = await fetchUserByEmail({
    userEmail,
    connection,
  });
  if (!isObjectEmpty(foundUser)) {
    if (!foundUser.verified) {
      const { verificationToken, verificationLink, verificationExpiry } =
        generateVerificationToken();
      await editUserEmail({
        userId: foundUser.id,
        userEmail,
        verificationToken,
        verificationExpiry,
        connection,
      });
      await sendEmail({
        emailReceiver: userEmail,
        emailSubject: "Please confirm your email",
        emailContent: `Hello,
          Please click on the link to verify your email:
  
          <a href=${verificationLink}>Click here to verify</a>`,
      });
      return formatResponse(responses.verificationTokenResent);
    }
    throw createError(...formatError(errors.userAlreadyVerified));
  }
  throw createError(...formatError(errors.emailNotFound));
};

export const updateEmail = async ({
  response,
  userEmail,
  userUsername,
  userPassword,
  connection,
}) => {
  await recoveryValidation.validate({
    userEmail,
    userUsername,
    userPassword,
  });
  const foundId = await fetchUserIdByUsername({
    userUsername,
    connection,
  });
  if (foundId) {
    const foundUser = await fetchUserByAuth({ userId: foundId, connection });

    if (isObjectEmpty(foundUser)) {
      throw createError(...formatError(errors.userDoesNotExist));
    } else if (!foundUser.active) {
      throw createError(...formatError(errors.userNoLongerActive));
    } else if (foundUser.verified) {
      throw createError(...formatError(errors.userAlreadyVerified));
    } else {
      const isValid = await argon2.verify(foundUser.password, userPassword);

      if (!isValid) {
        throw createError(...formatError(errors.userDoesNotExist));
      }
    }

    const emailUsed = await fetchUserIdByEmail({ userEmail, connection });
    if (emailUsed) {
      throw createError(...formatError(errors.emailAlreadyExists));
    } else {
      const { verificationToken, verificationLink, verificationExpiry } =
        generateVerificationToken();
      await editUserEmail({
        userId: foundId,
        userEmail,
        verificationToken,
        verificationExpiry,
        connection,
      });
      await sendEmail({
        emailReceiver: userEmail,
        emailSubject: "Please confirm your email",
        emailContent: `Hello,
        Please click on the link to verify your email:
  
        <a href=${verificationLink}>Click here to verify</a>`,
      });
      logUserOut(response);
      return formatResponse(responses.emailAddressUpdated);
    }
  }
  throw createError(...formatError(errors.userDoesNotExist));
};
