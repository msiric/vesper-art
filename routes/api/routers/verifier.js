import express from "express";
import { verifyLicense } from "../../../controllers/verifier";
import { requestHandler as handler } from "../../../utils/helpers";

const router = express.Router();

router
  .route("/verifier")
  // $TODO not tested
  .post(
    handler(verifyLicense, true, (req, res, next) => ({
      licenseData: { ...req.body },
    }))
  );

export default router;
