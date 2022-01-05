import express from "express";
import createError from "http-errors";
import { statusCodes } from "../../common/constants";
import { handleDelegatedError } from "../../utils/helpers";
import { errors } from "../../utils/statuses";
import artwork from "./routers/artwork";
import auth from "./routers/auth";
import checkout from "./routers/checkout";
import discount from "./routers/discount";
import notification from "./routers/notification";
import order from "./routers/order";
import search from "./routers/search";
import ticket from "./routers/ticket";
import user from "./routers/user";
import verifier from "./routers/verifier";

const router = express.Router();

router.use("/", user);
router.use("/", order);
router.use("/", artwork);
router.use("/", discount);
router.use("/", ticket);
router.use("/", verifier);
router.use("/", notification);
router.use("/", checkout);
router.use("/", search);
router.use("/auth", auth);

router.use((req, res, next) => {
  createError(statusCodes.internalError, errors.internalServerError.message);
});

router.use((err, req, res, next) => {
  const error = handleDelegatedError({ err });
  res.status(error.status);
  res.json({ ...error });
});

export default router;
