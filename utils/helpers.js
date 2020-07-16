import mongoose from "mongoose";
import createError from "http-errors";
import escapeHTML from "escape-html";
import jwt from "jsonwebtoken";

const ObjectId = mongoose.Types.ObjectId;

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
      return res.json(result || { message: "OK" });
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
      return res.json(result || { message: "OK" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const authentication = req.headers["authorization"];
    if (!authentication) throw createError(403, "Forbidden");
    const token = authentication.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true,
    });
    const data = jwt.decode(token);
    if (Date.now() >= data.exp * 1000 || !data.active)
      throw createError(401, "Not authenticated");
    res.locals.user = data;
  } catch (err) {
    console.log(err);
    next(err);
  }

  return next();
};

export const isNotAuthenticated = async (req, res, next) => {
  const authentication = req.headers["authorization"];
  // $TODO
  if (authentication) return console.log("REDIRECT");

  return next();
};

export const formatParams = ({ dataCursor, dataCeiling }) => {
  if (typeof dataCursor === "undefined" || typeof dataCeiling === "undefined")
    throw createError(400, "Invalid query parameters");
  const dataSkip =
    dataCursor && /^\d+$/.test(dataCursor) ? Number(dataCursor) : 0;
  const dataLimit =
    dataCeiling && /^\d+$/.test(dataCeiling) ? Number(dataCeiling) : 0;
  return { dataSkip, dataLimit };
};

export const checkParamsUsername = (req, res, next) => {
  let isValid = true;
  for (let param in req.params) {
    const value = req.params[param];
    if (!value) isValid = false;
    else if (typeof value !== "string") isValid = false;
  }
  if (isValid) return next();
  throw createError(400, "Invalid route parameter");
};

export const checkParamsId = (req, res, next) => {
  const isId = (id) => (ObjectId(id) ? true : false);
  let isValid = true;
  for (let param in req.params) {
    const value = req.params[param];
    if (!value) isValid = false;
    else if (!isId(value)) isValid = false;
  }
  if (isValid) return next();
  throw createError(400, "Invalid route parameter");
};

export const sanitizeData = (body) =>
  Object.keys(body).reduce((obj, key) => {
    if (Array.isArray(body[key])) {
      obj[key] = body[key].map((elem) => {
        if (typeof elem === "object") return sanitizeData(elem);
        return escapeHTML(elem);
      });
    } else if (typeof body[key] === "object") {
      obj[key] = sanitizeData(body[key]);
    } else {
      obj[key] = escapeHTML(body[key]);
    }
    return obj;
  }, {});
