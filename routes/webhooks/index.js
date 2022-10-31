import express from "express";
import createError from "http-errors";
import { statusCodes } from "../../common/constants";
import { handleDelegatedError } from "../../utils/helpers";
import { errors } from "../../utils/statuses";
import events from "./hooks/events";

const router = express.Router();

router.use("/", events);

router.use((req, res, next) => {
  createError(statusCodes.internalError, errors.internalServerError.message);
});

router.use((err, req, res, next) => {
  const error = handleDelegatedError({ err });
  res.status(error.status);
  res.json({ ...error });
});

export default router;
