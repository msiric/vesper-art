import express from "express";
import { receiveWebhookEvent } from "../../../controllers/stripe";
import { requestHandler as handler } from "../../../utils/helpers";

const router = express.Router();

router.route("/events").post(
  handler(receiveWebhookEvent, true, (req, res, next) => ({
    stripeSignature: req.headers["stripe-signature"],
    stripeBody: req.body,
  }))
);

export default router;
