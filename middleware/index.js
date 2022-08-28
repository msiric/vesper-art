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

export const requestHandler =
  (promise, transaction, params) => async (req, res, next) => {
    sanitizePayload(req, res, next);
    const boundParams = params ? params(req, res, next) : {};
    const userId = res?.locals?.user?.id ?? null;
    const handleRequest = (result) => {
      if (result) {
        return res.json(result);
      }
      return res.json({ message: "OK" });
    };
    if (transaction) {
      const queryRunner = await startTransaction();
      try {
        const result = await promise({
          userId,
          ...boundParams,
          connection: queryRunner.manager,
        });
        await evaluateTransaction(queryRunner);
        return handleRequest(result);
      } catch (error) {
        console.log("err", error);
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
          ...boundParams,
          connection,
        });
        return handleRequest(result);
      } catch (error) {
        console.log("err", error);
        next(error);
      }
    }
  };

export const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.headers["authorization"];
    if (!accessToken) throw createError(...formatError(errors.forbiddenAccess));
    const token = accessToken.split(" ")[1];
    const { data } = verifyTokenValidity(token, tokens.accessToken);
    if (!data.active) throw createError(...formatError(errors.forbiddenAccess));
    if (!data.verified)
      throw createError(...formatError(errors.forbiddenAccess));
    if (Date.now() >= data.exp * 1000) {
      throw createError(...formatError(errors.notAuthenticated));
    }
    res.locals.user = data;
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
  if (req.params.userId === res.locals.user.id) {
    return next();
  }
  return next(createError(...formatError(errors.notAuthorized)));
};
