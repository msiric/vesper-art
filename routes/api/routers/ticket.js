import express from "express";
import { postTicket } from "../../../controllers/ticket";
import {
  isAuthenticated,
  requestHandler as handler,
} from "../../../utils/helpers";

const router = express.Router();

// $TODO no automated tests
// $TODO only for test (remove in prod)
router
  .route("/contact")
  // $TODO not tested
  .post(
    [isAuthenticated],
    handler(postTicket, true, (req, res, next) => ({
      userEmail: res.locals.user ? res.locals.user.email : null,
    }))
  );

export default router;
