const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const createError = require('http-errors');
const escapeHTML = require('escape-html');
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const authentication = req.headers['authentication'];

  if (!authentication) {
    throw createError(401, 'Not authenticated');
  }

  try {
    const token = authentication.split(' ')[1];
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
  } catch (err) {
    console.log(err);
    throw createError(401, 'Not authenticated');
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
