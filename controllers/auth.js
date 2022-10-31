import createError from "http-errors";
import { appName } from "../common/constants";
import { isObjectEmpty } from "../common/helpers";
import {
  emailValidation,
  loginValidation,
  recoveryValidation,
  resetValidation,
  signupValidation,
} from "../common/validation";
import { renderEmail } from "../emails/template.js";
import {
  addNewUser,
  editUserResetToken,
  logUserOut,
  refreshAccessToken,
  resetUserPassword,
  resetVerificationToken,
  revokeAccessToken,
} from "../services/auth";
import {
  editUserEmail,
  fetchUserByAuth,
  fetchUserByEmail,
  fetchUserIdByCreds,
  fetchUserIdByEmail,
  fetchUserIdByUsername,
  fetchUserIdByVerificationToken,
  fetchUserResetTokenById,
} from "../services/user";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utils/auth";
import { formatEmailContent, sendEmail } from "../utils/email";
import {
  formatError,
  formatResponse,
  formatTokenData,
  generateResetToken,
  generateUuids,
  generateVerificationToken,
  hashString,
  verifyHash,
} from "../utils/helpers";
import { errors, responses } from "../utils/statuses";

// needs transaction (not tested)
export const postSignUp = async ({
  userName,
  userEmail,
  userUsername,
  userPassword,
  userConfirm,
  connection,
}) => {
  await signupValidation.validate({
    userName,
    userEmail,
    userUsername,
    userPassword,
    userConfirm,
  });
  const foundId = await fetchUserIdByCreds({
    userUsername,
    userEmail,
    connection,
  });
  if (foundId) {
    throw createError(...formatError(errors.userAlreadyExists));
  } else {
    const {
      verificationToken,
      verificationLink,
      verificationExpiry,
      verified,
    } = generateVerificationToken();
    const hashedPassword = await hashString(userPassword);
    const { userId } = generateUuids({
      userId: null,
    });
    await addNewUser({
      userId,
      userEmail,
      userName,
      userUsername,
      hashedPassword,
      verificationToken,
      verificationExpiry,
      verified,
      connection,
    });
    const emailValues = formatEmailContent({
      replacementValues: {
        heading: `You are one step away from joining ${appName}`,
        text: "Please click on the button below to verify your email",
        button: "Confirm email",
        redirect: verificationLink,
      },
      replacementAttachments: [],
    });
    await sendEmail({
      emailReceiver: userEmail,
      emailSubject: "Confirm your email",
      emailContent: renderEmail({ ...emailValues.formattedProps }),
      emailAttachments: emailValues.formattedAttachments,
    });
    return formatResponse(responses.userSignedUp);
  }
};

export const postLogIn = async ({
  userUsername,
  userPassword,
  response,
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
    } else if (!foundUser.verified) {
      throw createError(...formatError(errors.userNotVerified));
    } else {
      const isValid = await verifyHash(foundUser.password, userPassword);

      if (!isValid) {
        throw createError(...formatError(errors.userDoesNotExist));
      }
    }

    const { tokenPayload, userInfo } = formatTokenData({ user: foundUser });

    const refreshToken = createRefreshToken({ userData: tokenPayload });

    sendRefreshToken({ response, refreshToken });

    return {
      accessToken: createAccessToken({ userData: tokenPayload }),
      user: userInfo,
    };
  }
  throw createError(...formatError(errors.userDoesNotExist));
};

export const postLogOut = ({ response, connection }) => {
  return logUserOut({ response });
};

export const postRefreshToken = async ({ cookies, response, connection }) => {
  return await refreshAccessToken({ cookies, response, connection });
};

// $TODO not used?
export const postRevokeToken = async ({ userId, connection }) => {
  await revokeAccessToken({ userId, connection });
  return formatResponse(responses.accessTokenRevoked);
};

// needs transaction (not tested)
// $TODO can be improved (remove fetch call and just reset verification token - check if affected rows is not 0)
export const verifyRegisterToken = async ({ tokenId, connection }) => {
  const foundId = await fetchUserIdByVerificationToken({
    tokenId,
    connection,
  });
  if (foundId) {
    await resetVerificationToken({ tokenId, connection });
    return formatResponse(responses.registerTokenVerified);
  }
  throw createError(...formatError(errors.verificationTokenInvalid));
};

export const forgotPassword = async ({ userEmail, connection }) => {
  await emailValidation.validate({ userEmail });
  const userId = await fetchUserIdByEmail({ userEmail, connection });
  if (userId) {
    const { resetToken, resetLink, resetExpiry } = await generateResetToken({
      userId,
    });
    await editUserResetToken({
      userEmail,
      resetToken,
      resetExpiry,
      connection,
    });
    const emailValues = formatEmailContent({
      replacementValues: {
        heading: "Reset your password",
        text: "You are receiving this because you have requested to reset the password for your account. Please click on the button below to continue. If you don't recognize this action, please ignore this email.",
        button: "Reset password",
        redirect: resetLink,
      },
      replacementAttachments: [],
    });
    await sendEmail({
      emailReceiver: userEmail,
      emailSubject: "Reset your password",
      emailContent: renderEmail({ ...emailValues.formattedProps }),
      emailAttachments: emailValues.formattedAttachments,
    });
  }
  return formatResponse(responses.passwordReset);
};

// needs transaction (not tested)
export const resetPassword = async ({
  tokenId,
  userId,
  userPassword,
  userConfirm,
  connection,
}) => {
  const foundUser = await fetchUserResetTokenById({
    userId,
    connection,
  });
  if (!isObjectEmpty(foundUser) && !!foundUser.resetToken) {
    const isValid = await verifyHash(foundUser.resetToken, tokenId);
    if (isValid) {
      await resetValidation.validate({
        userPassword,
        userConfirm,
      });
      const isPasswordValid = await verifyHash(
        foundUser.password,
        userPassword
      );
      if (isPasswordValid)
        throw createError(...formatError(errors.newPasswordIdentical));
      const hashedPassword = await hashString(userPassword);
      await resetUserPassword({ userId, hashedPassword, connection });
      return formatResponse(responses.passwordUpdated);
    }
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
      const {
        verificationToken,
        verificationLink,
        verificationExpiry,
        verified,
      } = generateVerificationToken();
      await editUserEmail({
        userId: foundUser.id,
        userEmail: foundUser.email,
        verificationToken,
        verificationExpiry,
        verified,
        connection,
      });
      const emailValues = formatEmailContent({
        replacementValues: {
          heading: "Confirm your email",
          text: "You are receiving this because you have requested a new verification token to verify your account. Please click on the button below to continue. If you don't recognize this action, please ignore this email.",
          button: "Verify account",
          redirect: verificationLink,
        },
        replacementAttachments: [],
      });
      await sendEmail({
        emailReceiver: userEmail,
        emailSubject: "Verify your account",
        emailContent: renderEmail({ ...emailValues.formattedProps }),
        emailAttachments: emailValues.formattedAttachments,
      });
    } else {
      throw createError(...formatError(errors.userAlreadyVerified));
    }
  }
  return formatResponse(responses.verificationTokenResent);
};

export const updateEmail = async ({
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
    } else {
      const isValid = await verifyHash(foundUser.password, userPassword);

      if (!isValid) {
        throw createError(...formatError(errors.userDoesNotExist));
      }
    }

    const foundEmail = await fetchUserIdByEmail({ userEmail, connection });
    if (!foundEmail) {
      const {
        verificationToken,
        verificationLink,
        verificationExpiry,
        verified,
      } = generateVerificationToken();
      await editUserEmail({
        userId: foundId,
        userEmail,
        verificationToken,
        verificationExpiry,
        verified,
        connection,
      });
      const emailValues = formatEmailContent({
        replacementValues: {
          heading: "Verify new email",
          text: "You are receiving this because you have changed your email address. Please click on the button below to continue. If you don't recognize this action, please ignore this email.",
          button: "Confirm email",
          redirect: verificationLink,
        },
        replacementAttachments: [],
      });
      await sendEmail({
        emailReceiver: userEmail,
        emailSubject: "Confirm your email",
        emailContent: renderEmail({ ...emailValues.formattedProps }),
        emailAttachments: emailValues.formattedAttachments,
      });
    }
    return formatResponse(responses.emailAddressUpdated);
  }
  throw createError(...formatError(errors.userDoesNotExist));
};
