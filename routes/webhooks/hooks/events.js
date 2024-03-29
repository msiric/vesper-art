import express from "express";
import { receiveWebhookEvent } from "../../../controllers/stripe";
import { requestHandler as handler } from "../../../middleware/index";

const router = express.Router();

// $TODO No automated tests
router.route("/events").post(
  handler(receiveWebhookEvent, true, (req, res, next) => ({
    signature: req.headers["stripe-signature"],
    body: req.rawBody,
  }))
);

export default router;
