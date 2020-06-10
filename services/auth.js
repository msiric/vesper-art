import mongoose from 'mongoose';
import User from '../models/user.js';
import auth from '../utils/auth.js';
import crypto from 'crypto';
import mailer from '../utils/email.js';
import { server } from '../config/secret.js';
import config from '../config/mailer.js';
import createError from 'http-errors';

export const createNewUser = async ({
  email,
  username,
  password,
  token,
  session = null,
}) => {
  const newUser = new User();
  user.name = username;
  user.email = email;
  user.photo = user.gravatar();
  user.password = password;
  user.customWork = true;
  user.displaySaves = true;
  user.verificationToken = token;
  user.verified = false;
  user.cart = [];
  user.discount = null;
  user.inbox = 0;
  user.notifications = 0;
  user.rating = 0;
  user.reviews = 0;
  user.artwork = [];
  user.savedArtwork = [];
  user.purchases = [];
  user.sales = [];
  user.country = null;
  user.stripeId = null;
  user.active = true;
  return await newUser.save({ session });
};

export const logUserOut = (res) => {
  auth.sendRefreshToken(res, '');
  res.json({
    accessToken: '',
    user: '',
  });
};

export const refreshAccessToken = async (req, res, next) => {
  return await auth.updateAccessToken(req, res, next);
};

export const revokeAccessToken = async ({ userId, session = null }) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $inc: { jwtVersion: 1 } }
  );
};

export const updateUserVerification = async ({ tokenId, session = null }) => {
  return await User.updateOne(
    {
      verificationToken: tokenId,
    },
    { verificationToken: null, verified: true }
  ).session(session);
};

export const updateUserResetToken = async ({
  email,
  token,
  session = null,
}) => {
  return await User.updateOne(
    {
      email: email,
    },
    { resetToken: token, resetExpiry: Date.now() + 3600000 }
  ).session(session);
};

export const updateUserPassword = async ({ tokenId, password }) => {
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
export const verifyRegisterToken = async ({ tokenId, session = null }) => {
  return await User.updateOne(
    {
      verificationToken: tokenId,
    },
    { verificationToken: null, verified: true }
  ).session(session);
};

const forgotPassword = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email } = req.body;
    crypto.randomBytes(20, async function (err, buf) {
      const token = buf.toString('hex');
      const foundUser = await User.findOne({ email: email }).session(session);
      if (!foundUser) {
        throw createError(400, 'No account with that email address exists');
      } else {
        foundUser.resetToken = token;
        foundUser.resetExpiry = Date.now() + 3600000; // 1 hour
        await foundUser.save({ session });
        await mailer.sendEmail(
          config.app,
          foundUser.email,
          'Reset your password',
          `You are receiving this because you have requested to reset the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        
        <a href="${server.clientDomain}/reset_password/${token}"</a>`
        );
        await session.commitTransaction();
        res.status(200).json({ message: 'Password reset' });
      }
    });
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

// needs transaction (not tested)
const resetPassword = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { tokenId } = req.params;
    const { password, confirm } = req.body;
    const foundUser = await User.findOne({
      resetToken: tokenId,
      resetExpiry: { $gt: Date.now() },
    }).session(session);
    if (!foundUser) {
      throw createError(400, 'Token is invalid or has expired');
    } else if (password !== confirm) {
      throw createError(400, 'Passwords do not match');
    } else if (user.password === password) {
      throw createError(400, 'New password is identical to the old one');
    } else {
      foundUser.password = password;
      foundUser.resetToken = null;
      foundUser.resetExpiry = null;

      await foundUser.save(function (err) {
        req.logIn(foundUser, function (err) {
          callback(err, foundUser);
        });
      });
    }
    await mailer.sendEmail(
      config.app,
      foundUser.email,
      'Password change',
      `You are receiving this because you just changed your password.
        
      If you did not request this, please contact us immediately.`
    );
    await session.commitTransaction();
    res.status(200).json({ message: 'Password reset' });
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};
