import express from "express";
import { postTicket } from "../../../controllers/ticket";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers";

const router = express.Router();

router
  .route("/contact")
  // $TODO not tested
  .post(
    isAuthenticated,
    handler(postTicket, true, (req, res, next) => ({
      userEmail: res.locals.user ? res.locals.user.email : null,
    }))
  );

export default router;
