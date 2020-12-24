import argon2 from "argon2";
import { User } from "../../entities/User";
import { sendRefreshToken, updateAccessToken } from "../../utils/auth.js";

// $Done (mongo -> postgres)
export const addNewUser = async ({
  userEmail,
  userUsername,
  userPassword,
  verificationToken,
  session = null,
}) => {
  const hashedPassword = await argon2.hash(userPassword);
  const newUser = new User();
  newUser.email = userEmail;
  newUser.name = userUsername;
  newUser.password = hashedPassword;
  newUser.avatar = null;
  newUser.verificationToken = verificationToken;
  return await newUser.save({ session });
};

export const logUserOut = (res) => {
  sendRefreshToken(res, "");
  return { accessToken: "", user: "" };
};

export const refreshAccessToken = async (req, res, next) => {
  return await updateAccessToken(req, res, next);
};

export const revokeAccessToken = async ({ userId, session = null }) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $inc: { jwtVersion: 1 } }
  );
};

export const editUserVerification = async ({ tokenId, session = null }) => {
  return await User.updateOne(
    {
      verificationToken: tokenId,
    },
    { verificationToken: null, verified: true }
  ).session(session);
};

export const editUserResetToken = async ({
  userEmail,
  resetToken,
  session = null,
}) => {
  return await User.updateOne(
    {
      email: userEmail,
    },
    { resetToken, resetExpiry: Date.now() + 3600000 }
  ).session(session);
};

export const resetUserPassword = async ({
  tokenId,
  userPassword,
  session = null,
}) => {
  const hashedPassword = await argon2.hash(userPassword);
  return await User.updateOne(
    {
      resetToken: tokenId,
      resetExpiry: { $gt: Date.now() },
    },
    {
      password: hashedPassword,
      resetToken: null,
      resetExpiry: null,
    }
  ).session(session);
};

// needs transaction (not tested)
export const resetRegisterToken = async ({ tokenId }) => {
  return await User.updateOne(
    {
      verificationToken: tokenId,
    },
    { verificationToken: null, verified: true }
  );
};
