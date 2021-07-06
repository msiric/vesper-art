import argon2 from "argon2";
import User from "../../models/user";
import { sendRefreshToken, updateAccessToken } from "../../utils/auth";

export const addNewUser = async ({
  userEmail,
  userUsername,
  userPassword,
  verificationToken,
  session = null,
}) => {
  const hashedPassword = await argon2.hash(userPassword);
  const newUser = new User();
  newUser.name = userUsername;
  newUser.email = userEmail;
  newUser.avatar = newUser.gravatar();
  newUser.description = null;
  newUser.password = hashedPassword;
  newUser.customWork = true;
  newUser.displayFavorites = true;
  newUser.verificationToken = verificationToken;
  newUser.verified = false;
  newUser.inbox = 0;
  newUser.notifications = 0;
  newUser.rating = 0;
  newUser.reviews = 0;
  newUser.artwork = [];
  newUser.favorites = [];
  newUser.purchases = [];
  newUser.sales = [];
  newUser.country = null;
  newUser.businessAddress = null;
  newUser.stripeId = null;
  newUser.generated = false;
  newUser.active = true;
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
    { id: userId },
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
export const resetVerificationToken = async ({ tokenId }) => {
  return await User.updateOne(
    {
      verificationToken: tokenId,
    },
    { verificationToken: null, verified: true }
  );
};
