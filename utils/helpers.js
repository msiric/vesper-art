const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const createError = require('http-errors');
const escapeHTML = require('escape-html');
const jwt = require('jsonwebtoken');
const auth = require('../utils/auth');

const isAuthenticated = async (req, res, next) => {
  console.log(req.headers);
  const authentication = req.headers['authorization'];
  console.log('auth', authentication);
  if (!authentication) {
    throw createError(401, 'Not authenticated');
  }

  try {
    const token = authentication.split(' ')[1];
    let payload;
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true
    });
    const { exp } = jwt.decode(token);
    if (Date.now() >= exp * 1000) {
      const { accessToken } = await auth.updateAccessToken(req, res, next);
      if (!accessToken) throw createError(302, 'Redirecting');
      // const refreshToken = req.cookies.jid;
      // if (!refreshToken) {
      //   throw createError(401, 'Not authenticated');
      // }

      // let payload = null;
      // try {
      //   payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      // } catch (err) {
      //   console.log(err);
      //   throw createError(401, 'Not authenticated');
      // }

      // const foundUser = await User.findOne({ _id: payload.userId });

      // if (!foundUser) {
      //   throw createError(401, 'Not authenticated');
      // }

      // if (foundUser.jwtVersion !== payload.jwtVersion) {
      //   throw createError(401, 'Not authenticated');
      // }

      // const tokenPayload = {
      //   id: foundUser.id,
      //   name: foundUser.name,
      //   photo: foundUser.photo,
      //   inbox: foundUser.inbox,
      //   notifications: foundUser.notifications,
      //   cart: foundUser.cart.length,
      //   jwtVersion: foundUser.jwtVersion
      // };

      // auth.sendRefreshToken(res, auth.createRefreshToken(tokenPayload));
      // const updatedAccessToken = auth.createAccessToken(tokenPayload);
      // if (!updatedAccessToken) throw createError(401, 'Not authenticated');
    }
  } catch (err) {
    console.log(err);
    next(err);
  }

  return next();
};

const isLoggedInAPI = (req, res, next) => {
  // if (req.isAuthenticated()) return next();
  // res.status(401).json({ message: 'Unauthorized' });
  return next();
};

const isLoggedIn = (req, res, next) => {
  // if (req.isAuthenticated()) {
  //   return next();
  // }
  // res.redirect('/login');
  return next();
};

const isLoggedOut = (req, res, next) => {
  // if (!req.isAuthenticated()) return next();
  // res.redirect('/');
  return next();
};

const checkParams = (req, res, next) => {
  const isId = id => (ObjectId(id) ? true : false);
  let isValid = true;
  Object.keys(req.params).forEach(param => {
    const value = req.params[param];
    if (!value) isValid = false;
    else if (!isId(value)) isValid = false;
  });

  if (isValid) return next();
  throw createError(400, 'Invalid route parameter');
};

const sanitize = body =>
  Object.keys(body).reduce((obj, key) => {
    if (Array.isArray(body[key])) {
      obj[key] = body[key].map(elem => {
        if (typeof elem === 'object') return sanitize(elem);
        return escapeHTML(elem);
      });
    } else if (typeof body[key] === 'object') {
      obj[key] = sanitize(body[key]);
    } else {
      obj[key] = escapeHTML(body[key]);
    }
    return obj;
  }, {});

module.exports = {
  isAuthenticated,
  isLoggedInAPI,
  isLoggedIn,
  isLoggedOut,
  checkParams,
  sanitize
};
