import rateLimit from "express-rate-limit";
import createError from "http-errors";
import { environment, ENV_OPTIONS } from "../config/secret";
import { formatError } from "../utils/helpers";
import { errors } from "../utils/statuses";

const shouldLimit =
  environment !== ENV_OPTIONS.TESTING &&
  environment !== ENV_OPTIONS.DEVELOPMENT;

const sharedConfig = {
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: () => {
    throw createError(...formatError(errors.maxRequests));
  },
};

export const commonRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: shouldLimit ? 30 : 0, // limit each IP to 30 requests per windowMs if not testing or developing
  ...sharedConfig,
});

export const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: shouldLimit ? 5 : 0, // limit each IP to 5 requests per windowMs if not testing or developing
  ...sharedConfig,
});
