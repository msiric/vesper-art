import express from "express";
import createError from "http-errors";
import { handleDelegatedError } from "../../utils/helpers";
import events from "./hooks/events";

const router = express.Router();

router.use("/", events);

router.use((req, res, next) => {
  next(createError(404, "Endpoint not found"));
});

router.use((err, req, res, next) => {
  const error = handleDelegatedError({ err });
  res.status(error.status);
  res.json({ ...error });
});

export default router;
