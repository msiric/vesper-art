import express from "express";
import createError from "http-errors";
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
