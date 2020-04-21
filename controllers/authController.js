const mongoose = require('mongoose');
const User = require('../models/user');
const auth = require('../utils/auth');
const randomString = require('randomstring');
const axios = require('axios');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mailer = require('../utils/email');
const config = require('../config/mailer');
const createError = require('http-errors');

// needs transaction (not tested)
const postSignUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email, username, password, confirm } = req.body;
    const protocol = req.protocol;
    const host = req.get('host');
    const token = randomString.generate();
    const link = `${protocol}://${host}/verify_token/${token}`;
    const foundUser = await User.findOne({
      $or: [{ email: email }, { name: username }],
    }).session(session);
    if (foundUser) {
      throw createError(400, 'Account with that email/username already exists');
    } else {
      const user = new User();
      user.name = username;
      user.email = email;
      user.photo = user.gravatar();
      user.password = password;
      user.customWork = true;
      user.secretToken = token;
      user.verified = false;
      user.cart = [];
      user.discount = null;
      user.inbox = 0;
      user.notifications = 0;
      user.rating = 0;
      user.reviews = 0;
      user.artwork = [];
      user.savedArtwork = [];
      user.earnings = 0;
      user.incomingFunds = 0;
      user.outgoingFunds = 0;
      user.active = true;
      await user.save({ session });
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
    const foundUser = await User.findOne({
      $or: [{ email: username }, { name: username }],
    }).session(session);

    if (!foundUser) {
      throw createError(
        400,
        'Account with provided credentials does not exist'
      );
    }

    const valid = bcrypt.compareSync(password, foundUser.password);

    if (!valid) {
      throw createError(
        400,
        'Account with provided credentials does not exist'
      );
    }

    const tokenPayload = {
      id: foundUser._id,
      active: foundUser.active,
      jwtVersion: foundUser.jwtVersion,
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
      jwtVersion: foundUser.jwtVersion,
    };

    auth.sendRefreshToken(res, auth.createRefreshToken(tokenPayload));

    res.json({
      accessToken: auth.createAccessToken(tokenPayload),
      user: userInfo,
    });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
};

const postLogOut = async (req, res) => {
  try {
    auth.sendRefreshToken(res, '');
    res.json({
      accessToken: '',
      user: '',
    });
  } catch (err) {
    next(err, res);
  }
};

const postRefreshToken = async (req, res, next) => {
  const data = await auth.updateAccessToken(req, res, next);

  return res.json(data);
};

const postRevokeToken = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await User.findOneAndUpdate({ _id: userId }, { $inc: { jwtVersion: 1 } });
    res.status(200);
  } catch (err) {
    next(err, res);
  }
};

// needs transaction (not tested)
const verifyRegisterToken = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { tokenId } = req.params;
    const foundUser = await User.findOne({
      secretToken: tokenId,
    }).session(session);
    if (foundUser) {
      foundUser.secretToken = null;
      foundUser.verified = true;
      await foundUser.save({ session });
      await session.commitTransaction();
      res.status(200).json({ message: 'Token successfully verified' });
    } else {
      throw createError(400, 'Verification token could not be found');
    }
  } catch (err) {
    await session.abortTransaction();
    next(err, res);
  } finally {
    session.endSession();
  }
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
        foundUser.resetPasswordToken = token;
        foundUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await foundUser.save({ session });
        await mailer.sendEmail(
          config.app,
          foundUser.email,
          'Reset your password',
          `You are receiving this because you have requested to reset the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        
        <a href="http://${req.headers.host}/reset_password/${token}"</a>`
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
      resetPasswordToken: tokenId,
      resetPasswordExpires: { $gt: Date.now() },
    }).session(session);
    if (!foundUser) {
      throw createError(400, 'Token is invalid or has expired');
    } else if (password !== confirm) {
      throw createError(400, 'Passwords do not match');
    } else if (user.password === password) {
      throw createError(400, 'New password is identical to the old one');
    } else {
      foundUser.password = password;
      foundUser.resetPasswordToken = null;
      foundUser.resetPasswordExpires = null;

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

module.exports = {
  postSignUp,
  postLogIn,
  postLogOut,
  postRefreshToken,
  postRevokeToken,
  verifyRegisterToken,
  forgotPassword,
  resetPassword,
};
