const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const createError = require('http-errors');
const escapeHTML = require('escape-html');

const isLoggedInAPI = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const isLoggedOut = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.redirect('/');
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
  isLoggedInAPI,
  isLoggedIn,
  isLoggedOut,
  checkParams,
  sanitize
};
