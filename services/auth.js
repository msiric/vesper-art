import mongoose from 'mongoose';
import User from '../models/user.js';
import { updateAccessToken, sendRefreshToken } from '../utils/auth.js';

export const addNewUser = async ({
  userEmail,
  userUsername,
  userPassword,
  verificationToken,
  session = null,
}) => {
  const newUser = new User();
  newUser.name = userUsername;
  newUser.email = userEmail;
  newUser.photo = newUser.gravatar();
  newUser.password = userPassword;
  newUser.customWork = true;
  newUser.displaySaves = true;
  newUser.verificationToken = verificationToken;
  newUser.verified = false;
  newUser.discount = null;
  newUser.inbox = 0;
  newUser.notifications = 0;
  newUser.rating = 0;
  newUser.reviews = 0;
  newUser.artwork = [];
  newUser.savedArtwork = [];
  newUser.purchases = [];
  newUser.sales = [];
  newUser.country = null;
  newUser.origin = null;
  newUser.stripeId = null;
  newUser.active = true;
  return await newUser.save({ session });
};

export const logUserOut = (res) => {
  sendRefreshToken(res, '');
  return { accessToken: '', user: '' };
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

export const resetUserPassword = async ({ tokenId, password }) => {
  return await User.updateOne(
    {
      resetToken: tokenId,
      resetExpiry: { $gt: Date.now() },
    },
    {
      password: password,
      resetToken: null,
      resetExpiry: null,
    }
  ).session(session);
};

// needs transaction (not tested)
export const resetRegisterToken = async ({ tokenId, session = null }) => {
  return await User.updateOne(
    {
      verificationToken: tokenId,
    },
    { verificationToken: null, verified: true }
  ).session(session);
};
