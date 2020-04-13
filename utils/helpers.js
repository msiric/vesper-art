const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const createError = require('http-errors');
const escapeHTML = require('escape-html');
const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
  const authentication = req.headers['authorization'];
  if (!authentication) {
    throw createError(403, 'Forbidden');
  }

  try {
    const token = authentication.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true,
    });
    const data = jwt.decode(token);
    console.log(data);
    if (Date.now() >= data.exp * 1000 || !data.active)
      throw createError(401, 'Not authenticated');
    res.locals.user = data;
  } catch (err) {
    console.log(err);
    next(err);
  }

  return next();
};

const isNotAuthenticated = async (req, res, next) => {
  const authentication = req.headers['authorization'];
  if (authentication) {
    return console.log('REDIRECT');
  }

  return next();
};

const checkParams = (req, res, next) => {
  const isId = (id) => (ObjectId(id) ? true : false);
  let isValid = true;
  Object.keys(req.params).forEach((param) => {
    const value = req.params[param];
    if (!value) isValid = false;
    else if (!isId(value)) isValid = false;
  });

  if (isValid) return next();
  throw createError(400, 'Invalid route parameter');
};

const sanitize = (body) =>
  Object.keys(body).reduce((obj, key) => {
    if (Array.isArray(body[key])) {
      obj[key] = body[key].map((elem) => {
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
  isNotAuthenticated,
  checkParams,
  sanitize,
};
