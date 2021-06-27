import currency from "currency.js";
import { isBefore, isValid } from "date-fns";
import escapeHTML from "escape-html";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import * as uuidJs from "uuid";
import { errors } from "../common/constants";
import { domain, uuid } from "../config/secret";

// this way of importing allows specifying the uuid version in the config file only once and gets propagated everywhere
const {
  validate: validateUuid,
  version: validateVersion,
  [uuid.import]: genUuid,
} = uuidJs;

const VALID_PARAMS = {
  // better validation for stripeId?
  accountId: { isValid: (value) => isValidString(value) },
  artworkId: { isValid: (value) => isValidUuid(value) },
  commentId: { isValid: (value) => isValidUuid(value) },
  intentId: { isValid: (value) => isValidUuid(value) },
  orderId: { isValid: (value) => isValidUuid(value) },
  tokenId: { isValid: (value) => isValidUuid(value) },
  userId: { isValid: (value) => isValidUuid(value) },
  versionId: { isValid: (value) => isValidUuid(value) },
  userUsername: { isValid: (value) => isValidString(value) },
  discountCode: { isValid: (value) => isValidString(value) },
};

const VALID_QUERIES = {
  cursor: { isValid: (value) => isValidCursor(value) },
  limit: { isValid: (value) => isPositiveInteger(value) },
  start: { isValid: (value) => isPastDate(value) },
  end: { isValid: (value) => isPastDate(value) },
};

export const isValidCursor = (value) =>
  value === "" ||
  (validateUuid(value) && validateVersion(value) === uuid.version);

export const isValidUuid = (value) =>
  validateUuid(value) && validateVersion(value) === uuid.version;

export const isPositiveInteger = (value) =>
  value === "" || (parseInt(value) !== NaN && parseInt(value) > 0);

export const isValidString = (value) => typeof value === "string";

export const isPastDate = (value) =>
  isValid(new Date(value)) && isBefore(new Date(value), new Date());

/* export const isFutureDate = (value) =>
  isValid(new Date(value)) &&
  (isSameDay(new Date(value), new Date()) ||
    isAfter(new Date(value), new Date())); */

export const requestHandler =
  (promise, transaction, params) => async (req, res, next) => {
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
    // artworkType
    // if artworkAvailability === 'available'
    // then either 'free' or 'commercial'
    // else 'unavailable'

    // artworkLicense
    // if artworkAvailability === 'available'
    // then either 'personal' or 'commercial'
    // else 'unavailable'

    // artworkUse
    // if artworkAvailability === 'available' and artworkLicense === 'commercial'
    // then either 'separate' or 'included'
    // else 'unavailable'

    artworkType:
      data.artworkAvailability === "available"
        ? data.artworkType
        : "unavailable",
    artworkLicense:
      data.artworkAvailability === "available"
        ? data.artworkLicense
        : "unavailable",
    artworkUse:
      data.artworkAvailability === "available" &&
      data.artworkLicense === "commercial"
        ? data.artworkUse
        : "unavailable",
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
    // $TODO restore after tags are implemented
    // artworkTags: JSON.parse(data.artworkTags),
  };
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const authentication = req.headers["authorization"];
    if (!authentication)
      throw createError(errors.forbidden, "Forbidden", { expose: true });
    const token = authentication.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true,
    });
    const data = jwt.decode(token);
    if (Date.now() >= data.exp * 1000 || !data.active)
      throw createError(errors.unauthorized, "Not authenticated", {
        expose: true,
      });
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
  if (authentication)
    throw createError(errors.badRequest, "Already authenticated", {
      expose: true,
    });

  return next();
};

export const isAuthorized = async (req, res, next) => {
  if (req.params.userId === res.locals.user.id) {
    return next();
  }
  throw createError(errors.unauthorized, "Not authorized to request resource", {
    expose: true,
  });
};

export const sanitizeParams = (req, res, next) => {
  const isValid = sanitizeUrl(req.params, VALID_PARAMS);
  if (isValid) return next();
  throw createError(errors.badRequest, "Invalid route parameter", {
    expose: true,
  });
};

export const sanitizeQuery = (req, res, next) => {
  if (req && res && next) {
    const isValid = sanitizeUrl(req.query, VALID_QUERIES);
    if (isValid) {
      req.query = sanitizeData(req.query);
      return next();
    }
    throw createError(errors.badRequest, "Invalid route query", {
      expose: true,
    });
  }
  return;
};

export const sanitizeBody = (req, res, next) => {
  if (req && res && next) {
    req.body = sanitizeData(req.body);
    return next();
  }
  return;
};

export const sanitizeUrl = (data, validKeys) => {
  console.log(data, validKeys);
  let valid = true;
  for (let param in data) {
    console.log(typeof param, param);
    const value = data[param];
    if (value === "undefined") return false;
    if (validKeys[param] && !validKeys[param].isValid(value)) return false;
  }
  return valid;
};

export const sanitizeData = (data) => {
  return typeof data === "object"
    ? Object.keys(data).reduce((obj, key) => {
        if (data[key] === null) return obj;
        if (Array.isArray(data[key])) {
          obj[key] = data[key].map((elem) => {
            if (typeof elem === "object") return sanitizeData(elem);
            return escapeHTML(elem);
          });
        } else if (typeof data[key] === "object") {
          obj[key] = sanitizeData(data[key]);
        } else {
          obj[key] = escapeHTML(data[key]);
        }
        return obj;
      }, {})
    : data;
};

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
    generatedUuids[item] = genUuid();
  }
  return generatedUuids;
};

export const generateToken = () => {
  const verificationToken = genUuid();
  const verificationLink = `${domain.client}/verify_token/${verificationToken}`;
  return { verificationToken, verificationLink };
};

export const resolveSubQuery = (
  queryBuilder,
  alias,
  entity,
  cursor,
  threshold
) =>
  cursor
    ? queryBuilder
        .subQuery()
        .select(`${alias}.serial`)
        .from(entity, alias)
        .where(`${alias}.id = :id`, { id: cursor })
        .getQuery()
    : threshold;

export const calculateRating = ({ active, reviews }) =>
  active && reviews.length
    ? (
        reviews.reduce((sum, { rating }) => sum + rating, 0) / reviews.length
      ).toFixed(2)
    : null;
