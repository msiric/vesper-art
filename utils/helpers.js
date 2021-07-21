import crypto from "crypto";
import currency from "currency.js";
import { addHours, isBefore, isValid } from "date-fns";
import escapeHTML from "escape-html";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import * as uuidJs from "uuid";
import { statusCodes } from "../common/constants";
import { domain, tokens, uuid } from "../config/secret";
import {
  evaluateTransaction,
  releaseTransaction,
  rollbackTransaction,
  startTransaction,
} from "./database";
import { errors } from "./statuses";

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
        }
        return res.json(result);
      }
      return res.json({ message: "OK" });
    };
    if (transaction) {
      const queryRunner = await startTransaction();
      try {
        const result = await promise({
          userId,
          connection: queryRunner.manager,
          ...boundParams,
        });
        await evaluateTransaction(queryRunner);
        return handleRequest(result);
      } catch (error) {
        await rollbackTransaction(queryRunner);
        next(error);
      } finally {
        await releaseTransaction(queryRunner);
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
        next(error);
      }
    }
  };

export const isAuthenticated = async (req, res, next) => {
  try {
    const authentication = req.headers["authorization"];
    if (!authentication)
      return next(createError(...formatError(errors.forbiddenAccess)));
    const token = authentication.split(" ")[1];
    jwt.verify(token, tokens.accessToken, {
      ignoreExpiration: true,
    });
    const data = jwt.decode(token);
    console.log("DATA", data);
    if (!data.active)
      return next(createError(...formatError(errors.forbiddenAccess)));
    if (!data.verified)
      return next(createError(...formatError(errors.forbiddenAccess)));
    if (Date.now() >= data.exp * 1000)
      return next(createError(...formatError(errors.notAuthenticated)));
    res.locals.user = data;
  } catch (err) {
    console.log(err);
    return next(err);
  }

  return next();
};

export const isNotAuthenticated = async (req, res, next) => {
  const authentication = req.headers["authorization"];
  // $TODO ovo treba handleat tako da ne stucka frontend
  if (authentication)
    return next(createError(...formatError(errors.alreadyAuthenticated)));
  return next();
};

export const isAuthorized = async (req, res, next) => {
  if (req.params.userId === res.locals.user.id) {
    return next();
  }
  return next(createError(...formatError(errors.notAuthorized)));
};

export const sanitizeParams = (req, res, next) => {
  const isValid = sanitizeUrl(req.params, VALID_PARAMS);
  if (isValid) return next();
  return next(createError(...formatError(errors.routeParameterInvalid)));
};

export const sanitizeQuery = (req, res, next) => {
  if (req && res && next) {
    const isValid = sanitizeUrl(req.query, VALID_QUERIES);
    if (isValid) {
      req.query = sanitizeData(req.query);
      return next();
    }
    return next(createError(...formatError(errors.routeQueryInvalid)));
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
  let valid = true;
  for (let param in data) {
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

export const generateRandomBytes = ({ bytes }) => {
  const buffer = crypto.randomBytes(bytes);
  const randomBytes = buffer.toString("hex");
  return randomBytes;
};

export const generateVerificationToken = () => {
  const verificationToken = genUuid();
  const verificationLink = `${domain.client}/verify_token/${verificationToken}`;
  const verificationExpiry = addHours(new Date(), 1);
  return { verificationToken, verificationLink, verificationExpiry };
};

export const generateResetToken = () => {
  const resetToken = generateRandomBytes({ bytes: 20 });
  const resetLink = `${domain.client}/reset_password/${resetToken}`;
  const resetExpiry = addHours(new Date(), 1);
  return { resetToken, resetLink, resetExpiry };
};

export const generateLicenseFingerprint = () => {
  const licenseFingerprint = generateRandomBytes({ bytes: 20 });
  return { licenseFingerprint };
};

export const generateLicenseIdentifiers = () => {
  const licenseAssigneeIdentifier = generateRandomBytes({ bytes: 10 });
  const licenseAssignorIdentifier = generateRandomBytes({ bytes: 10 });
  return { licenseAssigneeIdentifier, licenseAssignorIdentifier };
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

export const formatError = ({ status, message, expose }) => [
  status,
  message,
  expose,
];

export const formatResponse = ({ status, message, expose, ...rest }) => ({
  status,
  message,
  expose,
  ...rest,
});

export const handleDelegatedError = ({ err }) => {
  return {
    status:
      err.name === "ValidationError"
        ? statusCodes.badRequest
        : err.status || statusCodes.internalError,
    message: err.message || errors.internalServerError.message,
    expose: err.expose || true,
  };
};

export const formatTokenData = ({ user }) => {
  const tokenPayload = {
    id: user.id,
    name: user.name,
    jwtVersion: user.jwtVersion,
    onboarded: !!user.stripeId,
    active: user.active,
    verified: user.verified,
  };

  const userInfo = {
    id: user.id,
    name: user.name,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    notifications: user.notifications,
    active: user.active,
    stripeId: user.stripeId,
    country: user.country,
    businessAddress: user.businessAddress,
    jwtVersion: user.jwtVersion,
    favorites: user.favorites,
  };

  return { tokenPayload, userInfo };
};

export const formattedArtworkKeys = {
  artworkTitle: "title",
  artworkType: "type",
  artworkAvailability: "availability",
  artworkLicense: "license",
  artworkUse: "use",
  artworkPersonal: "personal",
  artworkCommercial: "commercial",
  artworkDescription: "description",
  artworkVisibility: "visibility",
};

export const formatArtworkPrices = (data) => {
  return {
    ...data,
    artworkPersonal: currency(data.artworkPersonal).intValue,
    artworkCommercial: currency(data.artworkCommercial).intValue,
  };
};
