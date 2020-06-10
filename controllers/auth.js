import mongoose from 'mongoose';
import auth from '../utils/auth.js';
import randomString from 'randomstring';
import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import mailer from '../utils/email.js';
import { server } from '../config/secret.js';
import {
  createNewUser,
  logUserOut,
  refreshAccessToken,
  revokeAccessToken,
  updateUserVerification,
  updateUserResetToken,
  updateUserPassword,
} from '../services/auth.js';
import { fetchUserByCreds, fetchUserByToken } from '../services/user.js';
import config from '../config/mailer.js';
import createError from 'http-errors';

// needs transaction (not tested)
const postSignUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email, username, password, confirm } = req.body;
    const foundUser = await fetchUserByCreds({ username });
    if (foundUser) {
      throw createError(400, 'Account with that email/username already exists');
    } else {
      const token = randomString.generate();
      const link = `${server.clientDomain}/verify_token/${token}`;
      await createNewUser({ email, username, password, token });
      await mailer.sendEmail(
        config.app,
        email,
        'Please confirm your email',
        `Hello,
        Please click on the link to verify your email:

        <a href=${link}>Click here to verify</a>`
      );
      await session.commitTransaction();
      res.status(200).json({ message: 'Verify your email address' });
      await session.commitTransaction();
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const postLogIn = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { username, password } = req.body;
    const foundUser = await fetchUserByCreds({ username, session });
    if (!foundUser) {
      throw createError(
        400,
        'Account with provided credentials does not exist'
      );
    } else if (!foundUser.active) {
      throw createError(400, 'This account is no longer active');
    } else if (!foundUser.verified) {
      throw createError(400, 'Please verify your account');
    } else {
      const valid = bcrypt.compareSync(password, foundUser.password);

      if (!valid) {
        throw createError(
          400,
          'Account with provided credentials does not exist'
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

      auth.sendRefreshToken(res, auth.createRefreshToken(tokenPayload));

      res.json({
        accessToken: auth.createAccessToken(tokenPayload),
        user: userInfo,
      });
    }
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const postLogOut = (req, res) => {
  try {
    logUserOut(res);
  } catch (err) {
    next(err, res);
  }
};

const postRefreshToken = async (req, res, next) => {
  const data = await refreshAccessToken(req, res, next);
  return res.json(data);
};

const postRevokeToken = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await revokeAccessToken({ userId });
    res.status(200);
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (not tested)
const verifyRegisterToken = async (req, res, next) => {
  try {
    const { tokenId } = req.params;
    await updateUserVerification({ tokenId });
    res.status(200).json({ message: 'Token successfully verified' });
  } catch (err) {
    console.log(err);
    next(err, res);
  }
};

const forgotPassword = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email } = req.body;
    crypto.randomBytes(20, async function (err, buf) {
      const token = buf.toString('hex');
      await updateUserResetToken({ email, token });
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
    const updatedUser = await updateUserPassword({ tokenId, password });
    await mailer.sendEmail(
      config.app,
      updatedUser.email,
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

export default {
  postSignUp,
  postLogIn,
  postLogOut,
  postRefreshToken,
  postRevokeToken,
  verifyRegisterToken,
  forgotPassword,
  resetPassword,
};
