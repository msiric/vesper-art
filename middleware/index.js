import createError from "http-errors";
import { getConnection } from "typeorm";
import { tokens } from "../config/secret";
import {
  evaluateTransaction,
  releaseTransaction,
  rollbackTransaction,
  startTransaction,
} from "../utils/database";
import {
  formatError,
  sanitizePayload,
  verifyTokenValidity,
} from "../utils/helpers";
import { errors } from "../utils/statuses";

const verifyUserToken = (accessToken, locals) => {
  if (!accessToken) throw createError(...formatError(errors.forbiddenAccess));
  const token = accessToken.split(" ")[1];
  const { data } = verifyTokenValidity(token, tokens.accessToken);
  if (!data.active) throw createError(...formatError(errors.forbiddenAccess));
  if (!data.verified) throw createError(...formatError(errors.forbiddenAccess));
  if (Date.now() >= data.exp * 1000) {
    throw createError(...formatError(errors.notAuthenticated));
  }
  locals.user = data;
  return;
};

export const requestHandler =
  (promise, transaction, params) => async (req, res, next) => {
    sanitizePayload(req, res, next);
    const boundParams = params ? params(req, res, next) : {};
    const userId = res?.locals?.user?.id ?? null;
    const stripeId = res?.locals?.user?.stripeId ?? null;
    const connection = transaction ? await startTransaction() : getConnection();
    try {
      const result = await promise({
        userId,
        stripeId,
        ...boundParams,
        connection: transaction ? connection.manager : connection,
      });
      if (transaction) await evaluateTransaction(connection);
      if (result) return res.json(result);
      return res.json({ message: "OK" });
    } catch (error) {
      console.log("err", error);
      if (transaction) await rollbackTransaction(connection);
      next(error);
    } finally {
      if (transaction) await releaseTransaction(connection);
    }
  };

// doesn't throw error on fail
export const isAuthenticatedNoFail = (req, res, next) => {
  try {
    verifyUserToken(req.headers["authorization"], res.locals);
    return next();
  } catch (err) {
    return next();
  }
};

// throws error on fail
export const isAuthenticated = (req, res, next) => {
  try {
    verifyUserToken(req.headers["authorization"], res.locals);
    return next();
  } catch (err) {
    return next(err);
  }
};

export const isNotAuthenticated = async (req, res, next) => {
  const authentication = req.headers["authorization"];
  // $TODO ovo treba handleat tako da ne stucka frontend
  if (authentication)
    return next(createError(...formatError(errors.alreadyAuthenticated)));
  return next();
};

export const isAuthorized = async (req, res, next) => {
  if (req.params.userId) {
    if (req.params.userId !== res.locals.user.id) {
      return next(createError(...formatError(errors.notAuthorized)));
    }
  }
  if (req.params.accountId) {
    if (req.params.accountId !== res.locals.user.stripeId) {
      return next(createError(...formatError(errors.notAuthorized)));
    }
  }
  return next();
};
