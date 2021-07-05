import express from "express";
import createError from "http-errors";
import stripe from "./routers/stripe.js";

const router = express.Router();

router.use("/", stripe);

router.use((req, res, next) => {
  createError(statusCodes.internalError, "An error occurred");
});

router.use((err, req, res, next) => {
  res.status(err.status || statusCodes.internalError);
  res.json({
    status_code: err.status || statusCodes.internalError,
    error: err.message || "An error occurred",
    expose: !!err.expose,
  });
});

export default router;
