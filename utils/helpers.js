import currency from "currency.js";
import escapeHTML from "escape-html";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import randomString from "randomstring";
import { getConnection } from "typeorm";
import {
  v4 as uuidv4,
  validate as validateUuid,
  version as validateVersion,
} from "uuid";
import { server, uuid } from "../config/secret";

export const requestHandler = (promise, transaction, params) => async (
  req,
  res,
  next
) => {
  const boundParams = params ? params(req, res, next) : {};
  const userId = res.locals.user ? res.locals.user.id : null;
  const handleRequest = (result) => {
    if (result) {
      if (result.redirect) {
        return res.redirect(result.redirect);
      } else {
        return res.json(result);
      }
    } else {
      return res.json({ message: "OK" });
    }
  };
  if (transaction) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await promise({
        userId,
        connection: queryRunner.manager,
        ...boundParams,
      });
      /*  return await handleRequest(result); */
      await queryRunner.commitTransaction();
      return handleRequest(result);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      next(error);
    } finally {
      await queryRunner.release();
    }
  } else {
    try {
      const connection = getConnection();
      const result = await promise({
        userId,
        connection,
        ...boundParams,
      });
      return handleRequest(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};

export const formatArtworkValues = (data) => {
  return {
    ...data,
    artworkPersonal:
      data.artworkAvailability === "available" &&
      data.artworkType === "commercial"
        ? data.artworkUse === "separate" || data.artworkLicense === "personal"
          ? currency(data.artworkPersonal).intValue
          : 0
        : 0,
    artworkCommercial:
      data.artworkLicense === "commercial"
        ? data.artworkAvailability === "available" &&
          data.artworkLicense === "commercial" &&
          data.artworkUse === "separate"
          ? currency(data.artworkCommercial).add(data.artworkPersonal).intValue
          : currency(data.artworkPersonal).intValue
        : 0,
    artworkTags: JSON.parse(data.artworkTags),
  };
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
  // $TODO ovo treba handleat tako da ne stucka frontend
  if (authentication) throw createError(400, "Already authenticated");

  return next();
};

export const formatParams = ({ dataCursor, dataCeiling }) => {
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

export const isValidUuid = (value) =>
  validateUuid(value) && validateVersion(value) === uuid.version;

export const checkParamsId = (req, res, next) => {
  let isValid = true;
  for (let param in req.params) {
    const value = req.params[param];
    if (!value) isValid = false;
    else if (!isValidUuid(value)) isValid = false;
  }
  if (isValid) return next();
  throw createError(400, "Invalid route parameter");
};

export const sanitizeData = (body) =>
  Object.keys(body).reduce((obj, key) => {
    if (body[key] === null) return obj;
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

export const checkImageOrientation = (width, height) => {
  if (width > height) {
    return "landscape";
  } else if (width < height) {
    return "portrait";
  } else {
    return "square";
  }
};

export const generateUuids = ({ ...args }) => {
  const generatedUuids = {};
  for (let item in args) {
    generatedUuids[item] = uuidv4();
  }
  return generatedUuids;
};

export const generateToken = () => {
  const verificationToken = randomString.generate();
  const verificationLink = `${server.clientDomain}/verify_token/${verificationToken}`;
  return { verificationToken, verificationLink };
};
