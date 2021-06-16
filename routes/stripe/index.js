import express from "express";
import createError from "http-errors";
import { errors } from "../../common/constants.js";
import stripe from "./routers/stripe.js";

const router = express.Router();

router.use("/", stripe);

router.use((req, res, next) => {
  createError(errors.internalError, "An error occurred");
});

router.use((err, req, res, next) => {
  res.status(err.status || errors.internalError);
  res.json({
    status_code: err.status || errors.internalError,
    error: err.message,
  });
});

export default router;
