import express from "express";
import { verifyLicense } from "../../../controllers/verifier.js";
import { requestHandler as handler } from "../../../utils/helpers.js";

const router = express.Router();

router
  .route("/verifier")
  // $TODO not tested
  .post(
    handler(verifyLicense, (req, res, next) => ({
      ...req.body,
    }))
  );

export default router;
