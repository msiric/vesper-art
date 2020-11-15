import express from "express";
import createError from "http-errors";
import artwork from "./routers/artwork.js";
import auth from "./routers/auth.js";
import checkout from "./routers/checkout.js";
import comment from "./routers/comment.js";
import discount from "./routers/discount.js";
import notification from "./routers/notification.js";
import order from "./routers/order.js";
import review from "./routers/review.js";
import search from "./routers/search.js";
import ticket from "./routers/ticket.js";
import user from "./routers/user.js";
import verifier from "./routers/verifier.js";

const router = express.Router();

router.use("/", user);
router.use("/", order);
router.use("/", artwork);
router.use("/", review);
router.use("/", discount);
router.use("/", ticket);
router.use("/", verifier);
router.use("/", notification);
router.use("/", checkout);
router.use("/", comment);
router.use("/", search);
router.use("/auth", auth);

router.use((req, res, next) => {
  createError(404);
});

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status_code: err.status || 500, error: err.message });
});

export default router;
