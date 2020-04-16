const mongoose = require('mongoose');
const User = require('../models/user');
const auth = require('../utils/auth');
const randomString = require('randomstring');
const axios = require('axios');
const bcrypt = require('bcrypt-nodejs');
const createError = require('http-errors');

// needs transaction (not tested)
const postSignUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email, username, password } = req.body;
    const foundUser = await User.findOne({
      $or: [{ email: email }, { name: username }],
    }).session(session);
    if (foundUser) {
      throw createError(400, 'Account with that email/username already exists');
    } else {
      let verificationInfo = {
        token: randomString.generate(),
        email: email,
      };
      let user = new User();
      user.name = username;
      user.email = email;
      user.photo = user.gravatar();
      user.password = password;
      user.customWork = true;
      user.secretToken = verificationInfo.token;
      user.verified = false;
      user.cart = [];
      user.discount = null;
      user.inbox = 0;
      user.notifications = 0;
      user.rating = 0;
      user.reviews = 0;
      user.savedArtwork = [];
      user.earnings = 0;
      user.incomingFunds = 0;
      user.outgoingFunds = 0;
      user.active = true;
      await user.save({ session });
      await axios.post('http://localhost:3000/send_email', verificationInfo, {
        proxy: false,
      });
      await session.commitTransaction();
      return res.redirect('/signup');
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

    const valid = await bcrypt.compareSync(password, foundUser.password);

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

module.exports = {
  postSignUp,
  postLogIn,
  postLogOut,
  postRefreshToken,
  postRevokeToken,
};
