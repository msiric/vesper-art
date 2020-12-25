import express from "express";
import { postTicket } from "../../../controllers/ticket.js";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers.js";

const router = express.Router();

router.route("/contact_support").post(
  isAuthenticated,
  handler(postTicket, (req, res, next) => ({
    userEmail: res.locals.user ? res.locals.user.email : null,
  }))
);

export default router;
