import argon2 from "argon2";
import crypto from "crypto";
import { addHours, endOfDay, isBefore, isValid, startOfDay } from "date-fns";
import escapeHTML from "escape-html";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import * as uuidJs from "uuid";
import { featureFlags, generatedData, statusCodes } from "../common/constants";
import { trimAllSpaces } from "../common/helpers";
import { domain, uuid } from "../config/secret";
import { errors } from "./statuses";

// this way of importing allows specifying the uuid version in the config file only once and gets propagated everywhere
const {
  validate: validateUuid,
  version: validateVersion,
  [uuid.import]: genUuid,
} = uuidJs;

const TRIM_KEYS = {
  licenseCompany: true,
};

const LOWERCASE_KEYS = {
  userEmail: true,
};

const VALID_PARAMS = {
  // better validation for stripeId?
  accountId: { isValid: (value) => isValidString(value) },
  artworkId: { isValid: (value) => isValidUuid(value) },
  commentId: { isValid: (value) => isValidUuid(value) },
  intentId: { isValid: (value) => isValidUuid(value) },
  orderId: { isValid: (value) => isValidUuid(value) },
  tokenId: { isValid: (value) => isValidString(value) },
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

export const ARTWORK_KEYS = {
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

export const sanitizePayload = (req, res, next) => {
  try {
    sanitizeParams(req, res, next);
    sanitizeQuery(req, res, next);
    sanitizeBody(req, res, next);
  } catch (err) {
    next(err);
  }
};

export const sanitizeParams = (req, res, next) => {
  const isValid = sanitizeUrl(req.params, VALID_PARAMS);
  if (!isValid) throw createError(...formatError(errors.routeParameterInvalid));
};

export const sanitizeQuery = (req, res, next) => {
  const isValid = sanitizeUrl(req.query, VALID_QUERIES);
  if (isValid) req.query = sanitizeDates(sanitizeData(req.query));
  else throw createError(...formatError(errors.routeQueryInvalid));
};

export const sanitizeBody = (req, res, next) => {
  req.body = sanitizeData(req.body);
};

export const sanitizeUrl = (data, validKeys) => {
  for (let param in data) {
    const value = data[param];
    if (value === undefined) return false;
    if (validKeys[param] && !validKeys[param].isValid(value)) return false;
  }
  return true;
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
        } else if (typeof data[key] === "string") {
          if (TRIM_KEYS[key]) {
            data[key] = trimAllSpaces(data[key]);
          }
          if (LOWERCASE_KEYS[key]) {
            data[key] = data[key].toLowerCase();
          }
          obj[key] = escapeHTML(data[key]);
        } else {
          obj[key] = escapeHTML(data[key]);
        }
        return obj;
      }, {})
    : data;
};

export const sanitizeDates = (data) => {
  for (let param in data) {
    const value = data[param];
    if (param === "start") {
      data[param] = startOfDay(new Date(data[param]));
    }
    if (param === "end") {
      data[param] = endOfDay(new Date(data[param]));
    }
  }
  return data;
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
  const verificationToken = generateRandomBytes({ bytes: 20 });
  const verificationLink = `${domain.client}/verify_token/${verificationToken}`;
  const verificationExpiry = addHours(new Date(), 1);
  const verified = false;
  return {
    verificationToken,
    verificationLink,
    verificationExpiry,
    verified,
  };
};

export const generateResetToken = async ({ userId }) => {
  const randomBytes = generateRandomBytes({ bytes: 30 });
  const resetToken = await hashString(randomBytes);
  const resetLink = `${domain.client}/reset_password/user/${userId}/token/${randomBytes}`;
  const resetExpiry = addHours(new Date(), 1);
  return { resetToken, resetLink, resetExpiry, randomBytes };
};

export const generateLicenseFingerprint = () => {
  const licenseFingerprint = generateRandomBytes({
    bytes: generatedData.fingerprint,
  });
  return { licenseFingerprint };
};

export const generateLicenseIdentifiers = () => {
  const licenseAssigneeIdentifier = generateRandomBytes({
    bytes: generatedData.identifier,
  });
  const licenseAssignorIdentifier = generateRandomBytes({
    bytes: generatedData.identifier,
  });
  return { licenseAssigneeIdentifier, licenseAssignorIdentifier };
};

export const resolveDateRange = ({ start, end }) => {
  if (start && end) {
    const startDate = startOfDay(start);
    const endDate = endOfDay(end);
    return { startDate, endDate };
  }
  throw createError(...formatError(errors.routeQueryInvalid));
};

export const calculateRating = ({ active, reviews }) =>
  active && reviews.length
    ? (
        reviews.reduce((sum, { rating }) => sum + rating, 0) / reviews.length
      ).toFixed(2)
    : null;

export const formatError = ({ status, message, expose }) => [
  status,
  message,
  { expose },
];

export const formatResponse = ({ status, message, expose, ...rest }) => ({
  status,
  message,
  expose,
  ...rest,
});

export const handleDelegatedError = ({ err }) => {
  const validationError = "ValidationError";
  const multerError = "MulterError";
  const knownErrors = [validationError, multerError];

  return {
    status: knownErrors.includes(err.name)
      ? statusCodes.badRequest
      : err.status || statusCodes.internalError,
    message:
      knownErrors.includes(err.name) || err.expose
        ? err.message
        : errors.internalServerError.message,
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

export const verifyTokenValidity = (
  publicToken,
  privateToken,
  shouldValidateExpiry = true
) => {
  try {
    jwt.verify(publicToken, privateToken, {
      ignoreExpiration: true,
    });
  } catch (err) {
    throw createError(...formatError(errors.forbiddenAccess));
  }
  const data = jwt.decode(publicToken);
  if (shouldValidateExpiry && Date.now() >= data.exp * 1000)
    throw createError(...formatError(errors.notAuthenticated));
  return { data };
};

export const verifyVersionValidity = ({ data, foundUser, foundAccount }) => {
  if (data.artworkPersonal || data.artworkCommercial) {
    // FEATURE FLAG - stripe
    if (!featureFlags.stripe) {
      throw createError(...formatError(errors.commercialArtworkUnavailable));
    }
    if (!foundUser.stripeId) {
      throw createError(...formatError(errors.stripeOnboardingIncomplete));
    }
    if (
      (data.artworkPersonal || data.artworkCommercial) &&
      (!foundAccount || foundAccount.capabilities.transfers !== "active")
    ) {
      throw createError(...formatError(errors.stripeAccountIncomplete));
    }
  }
  return;
};

export const verifyHash = async (storedHash, givenString) =>
  await argon2.verify(storedHash, givenString);

export const hashString = async (givenString) => await argon2.hash(givenString);
