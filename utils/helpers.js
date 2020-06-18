import mongoose from 'mongoose';
import createError from 'http-errors';
import escapeHTML from 'escape-html';
import jwt from 'jsonwebtoken';
import currency from 'currency.js';
import aws from 'aws-sdk';

const ObjectId = mongoose.Types.ObjectId;

export const deleteS3Object = async ({ link, folder }) => {
  const fileLink = link;
  const folderName = folder;
  const fileName = fileLink.split('/').slice(-1)[0];
  const filePath = folderName + fileName;
  const awsObject = new aws.S3();
  const awsParams = {
    Bucket: 'vesper-testing',
    Key: filePath,
  };
  await awsObject.deleteObject(awsParams).promise();
};

export const formatParams = ({ cursor, ceiling }) => {
  const skip = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
  const limit = ceiling && /^\d+$/.test(ceiling) ? Number(ceiling) : 0;
  return { skip, limit };
};

export const requestHandler = (promise, transaction, params) => async (
  req,
  res,
  next
) => {
  const boundParams = params ? params(req, res, next) : {};
  const userId = res.locals.user ? res.locals.user.id : null;
  if (transaction) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const result = await promise({ userId, session, ...boundParams });
      await session.commitTransaction();
      return res.json(result || { message: 'OK' });
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  } else {
    try {
      const result = await promise({ userId, ...boundParams });
      return res.json(result || { message: 'OK' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const authentication = req.headers['authorization'];
    if (!authentication) throw createError(403, 'Forbidden');
    const token = authentication.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true,
    });
    const data = jwt.decode(token);
    if (Date.now() >= data.exp * 1000 || !data.active)
      throw createError(401, 'Not authenticated');
    res.locals.user = data;
  } catch (err) {
    console.log(err);
    next(err);
  }

  return next();
};

export const isNotAuthenticated = async (req, res, next) => {
  const authentication = req.headers['authorization'];
  if (authentication) return console.log('REDIRECT');

  return next();
};

export const checkParams = (req, res, next) => {
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

export const formatPrice = (value) => {
  return currency(value).divide(100);
};

export const sanitize = (body) =>
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
