import express from "express";
import { verifyLicense } from "../../../controllers/verifier";
import { requestHandler as handler } from "../../../middleware/index";
const router = express.Router();

// Public routes
router
  .route("/verifier")
  // $TODO not tested
  .post(
    handler(verifyLicense, true, (req, res, next) => ({
      licenseFingerprint: req.body.licenseFingerprint,
      assigneeIdentifier: req.body.assigneeIdentifier,
      assignorIdentifier: req.body.assignorIdentifier,
    }))
  );

export default router;
